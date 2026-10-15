#!/usr/bin/env python3
"""download_data.py — Fetch raw source datasets for the Global Food Crisis website.

Downloads (with fallback to previously downloaded copies when a source is
unreachable, so the pipeline remains reproducible offline):

1. Prevalence of undernourishment (% of population), by country, 2000–2024
   Source: Our World in Data grapher CSV (republishes FAO, SDG indicator 2.1.1)
   https://ourworldindata.org/grapher/prevalence-of-undernourishment.csv
   License: CC BY 4.0 (OWID), underlying data (c) FAO.

2. Number of undernourished people in the world, 2001–2023
   Source: World Bank WDI indicator SN.ITK.DEFC (data (c) FAO)
   https://api.worldbank.org/v2/country/WLD/indicator/SN.ITK.DEFC

3. Natural Earth 50m admin-0 country boundaries (public domain)
   https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/

Datasets that cannot be fetched programmatically (Cloudflare-gated downloads)
are curated in data/manual/ with full provenance documented in docs/sources.md:
- FAO Food Price Index annual values (anchors verified against FAO releases)
- GRFC 2016–2025 acute food insecurity series + 2025 driver breakdown
  (transcribed from the GRFC 2026 report, verified against press materials)

Usage:
    python3 scripts/download_data.py [--force]
"""

import csv
import io
import json
import os
import sys
import time
import urllib.request

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(BASE, "data", "raw")

SOURCES = {
    "prevalence-of-undernourishment.csv": {
        "url": "https://ourworldindata.org/grapher/prevalence-of-undernourishment.csv",
        "note": "FAO SDG 2.1.1 via Our World in Data, CC BY 4.0",
    },
    "wb-world-undernourished.json": {
        "url": (
            "https://api.worldbank.org/v2/country/WLD/indicator/SN.ITK.DEFC"
            "?format=json&per_page=100&date=1999:2026"
        ),
        "note": "World Bank WDI SN.ITK.DEFC (FAO), CC BY 4.0",
    },
    "ne_50m_admin_0_countries.geojson": {
        "url": (
            "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/"
            "master/geojson/ne_50m_admin_0_countries.geojson"
        ),
        "note": "Natural Earth 50m, public domain",
    },
}


def fetch(url: str, timeout: int = 90, retries: int = 3) -> bytes:
    last = None
    for attempt in range(1, retries + 1):
        try:
            req = urllib.request.Request(
                url, headers={"User-Agent": "global-food-crisis-data-pipeline/1.0"}
            )
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return resp.read()
        except Exception as exc:  # noqa: BLE001 - report and retry
            last = exc
            print(f"  attempt {attempt}/{retries} failed: {exc}")
            time.sleep(2 * attempt)
    raise RuntimeError(f"could not fetch {url}: {last}")


def main() -> int:
    force = "--force" in sys.argv
    os.makedirs(RAW, exist_ok=True)
    ok = True
    for filename, spec in SOURCES.items():
        dest = os.path.join(RAW, filename)
        if os.path.exists(dest) and not force:
            print(f"[skip] {filename} already present ({os.path.getsize(dest)} bytes)")
            continue
        print(f"[get ] {filename} <- {spec['url']}")
        try:
            data = fetch(spec["url"])
            # sanity check the payload before writing
            if filename.endswith(".json"):
                json.loads(data)
            elif filename.endswith(".geojson"):
                gj = json.loads(data)
                assert gj.get("type") == "FeatureCollection", "not a FeatureCollection"
            else:
                text = data.decode("utf-8-sig")
                rows = list(csv.DictReader(io.StringIO(text)))
                assert rows, "empty CSV"
                assert "Entity" in rows[0], "unexpected OWID CSV header"
            with open(dest, "wb") as fh:
                fh.write(data)
            print(f"        saved {len(data)} bytes ({spec['note']})")
        except Exception as exc:  # noqa: BLE001
            ok = False
            print(f"        FAILED: {exc}")
            if os.path.exists(dest):
                print("        keeping previously downloaded copy")
    if not ok:
        print("\nSome downloads failed. Existing copies under data/raw/ (if any) "
              "will be used by process_data.py.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
