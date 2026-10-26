#!/usr/bin/env python3
"""Export the Chapter 5 download CSV (trend.csv) from trend.json.

Columns: year, world_share_percent (FAO via OWID), world_number_millions
(FAO via the World Bank's Health Nutrition and Population Statistics), plus the SOFI 2026 point for 2025. Source notes
are embedded as CSV comments so the file is self-describing.
"""
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "data" / "trend.json"
DST = ROOT / "public" / "data" / "trend.csv"

data = json.loads(SRC.read_text())

rows = []
numbers = {p["year"]: p["value"] for p in data["worldNumber"]}
for p in data["worldPercent"]:
    rows.append(
        {
            "year": p["year"],
            "world_share_percent": p["value"],
            "world_number_millions": numbers.get(p["year"], ""),
            "note": "",
        }
    )
sofi_pct = data["sofi2026"]["percent"][0]
sofi_num = data["sofi2026"]["number"][0]
rows.append(
    {
        "year": sofi_pct["year"],
        "world_share_percent": sofi_pct["value"],
        "world_number_millions": sofi_num["value"],
        "note": "SOFI 2026 (newest vintage)",
    }
)

with DST.open("w", newline="", encoding="utf-8") as fh:
    fh.write("# Global Food Crisis - Chapter 01 - Chapter 5 data\n")
    fh.write("# world_share_percent: FAO, Prevalence of undernourishment (SDG 2.1.1), via Our World in Data\n")
    fh.write("# world_number_millions: FAO via World Bank Health Nutrition and Population Statistics (SN.ITK.DEFC), through 2023\n")
    fh.write("# 2025 row: SOFI 2026 newest vintage (FAO et al., published 2026-07-21)\n")
    fh.write(f"# Retrieved {data['metaPercent'].get('retrieved', '2026-10-15')}\n")
    writer = csv.DictWriter(fh, fieldnames=["year", "world_share_percent", "world_number_millions", "note"])
    writer.writeheader()
    writer.writerows(rows)

print(f"Wrote {DST} ({len(rows)} rows)")
