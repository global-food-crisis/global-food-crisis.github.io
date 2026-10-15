#!/usr/bin/env python3
"""process_data.py — Build the static JSON data files for the website.

Inputs (produced by download_data.py / curated in data/manual/):
  data/raw/prevalence-of-undernourishment.csv  (FAO SDG 2.1.1 via OWID)
  data/raw/wb-world-undernourished.json        (World Bank WDI SN.ITK.DEFC)
  data/raw/ne_50m_admin_0_countries.geojson    (Natural Earth 50m)
  data/manual/fao-food-price-index.csv         (FAO FFPI annual, verified)
  data/manual/grfc-acute-food-insecurity.csv   (GRFC 2016-2025 series)
  data/manual/grfc-drivers-2025.csv            (GRFC 2025 driver breakdown)

Outputs (consumed by the website at runtime):
  public/data/pou-country.json
  public/data/trend.json
  public/data/food-price-index.json
  public/data/acute-food-insecurity.json
  public/data/world-map.json

Every output embeds a `meta` block recording publisher, source URL, license,
reference period and retrieval date, so provenance travels with the data.
"""

import csv
import json
import os
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(BASE, "data", "raw")
MANUAL = os.path.join(BASE, "data", "manual")
OUT = os.path.join(BASE, "public", "data")

RETRIEVED = "2026-10-15"

# --- manual reference data -------------------------------------------------

# ISO alpha-3 -> alpha-2 for entities that carry PoU data but are missing from
# (or ambiguous in) the Natural Earth 50m property table.
A3_TO_A2_EXTRA = {
    "XKX": "XK",  # Kosovo (user-assigned)
    "PSE": "PS",  # State of Palestine
    "HKG": "HK",  # Hong Kong
    "MAC": "MO",  # Macao
    "TWN": "TW",  # Taiwan
    "FRA": "FR",  # Natural Earth ships ISO_A2 '-99' for France
    "NOR": "NO",  # ... and for Norway
    "OWID_WRL": None,
}

# Natural Earth ADM0_A3 -> our display/data ISO alpha-3 fixes.
# SOL (Somaliland), CYN (Northern Cyprus), KAS (Siachen) have no ISO alpha-3
# and no undernourishment data; they keep their Natural Earth codes as unique
# join keys and simply render as "no data".
NE_CODE_FIXES = {
    "PSX": "PSE",  # Palestine
}


def read_csv_rows(path):
    with open(path, newline="", encoding="utf-8-sig") as fh:
        rows = [r for r in csv.reader(fh) if r and not r[0].startswith("#")]
    header = rows[0]
    out = []
    for r in rows[1:]:
        out.append(dict(zip(header, r)))
    return out


def r1(x):
    return round(x, 1)


def r2(x):
    return round(x, 2)


# --- 1. Prevalence of undernourishment by country --------------------------


def build_pou_country():
    rows = read_csv_rows(os.path.join(RAW, "prevalence-of-undernourishment.csv"))
    col = [k for k in rows[0].keys() if "prevalence" in k][0]
    # entities to exclude: aggregates & income groups (they live in trend.json)
    exclude = lambda e: (
        "(" in e
        or e == "World"
        or e.startswith("Low")
        or e.startswith("Upper-middle")
        or e.startswith("High-income")
        or e.startswith("Land Locked")
        or e.startswith("Small Island")
        or e.startswith("Least Developed")
        or e == "Africa"
        or e == "Asia"
        or e == "Europe"
        or e == "Oceania"
    )
    per_country = {}
    names = {}
    for r in rows:
        entity, code, year = r["Entity"], r["Code"], r["Year"]
        if not code or code.startswith("OWID") or exclude(entity):
            continue
        names[code] = entity
        if col in r and r[col]:
            y = int(year)
            v = float(r[col])
            if code not in per_country or y > per_country[code][0]:
                per_country[code] = (y, v)

    countries = []
    for code, (year, value) in sorted(per_country.items()):
        # FAO convention: countries below 2.5% prevalence are reported as 2.5
        below = value == 2.5
        # Flag assessments older than 2021 as stale: they are kept for
        # transparency in the data table but rendered as "no recent data"
        # on the map so that outdated values cannot be mistaken for current
        # ones (e.g. Cuba's last assessment 2006, DPR Korea 2018).
        stale = year < 2021
        countries.append(
            {
                "code": code,
                "name": names[code],
                "year": year,
                "value": r1(value),
                "below": below,
                "stale": stale,
            }
        )

    meta = {
        "publisher": "FAO",
        "dataset": "Prevalence of undernourishment (SDG indicator 2.1.1), country level",
        "url": "https://ourworldindata.org/grapher/prevalence-of-undernourishment.csv",
        "republishedBy": "Our World in Data",
        "license": "CC BY 4.0 (OWID); underlying data (c) FAO",
        "referenceYear": "latest available per country (2022-2023)",
        "retrieved": RETRIEVED,
        "note": (
            "FAO reports '<2.5%' for countries whose prevalence is below 2.5%; "
            "such values are flagged with below=true. Entries with stale=true "
            "have no assessment since 2020 and render as 'no recent data' on "
            "the map. FAO revises this series periodically - see "
            "docs/methodology.md."
        ),
    }
    return {"meta": meta, "countries": countries}


# --- 2. Historical trend ---------------------------------------------------


def build_trend():
    rows = read_csv_rows(os.path.join(RAW, "prevalence-of-undernourishment.csv"))
    col = [k for k in rows[0].keys() if "prevalence" in k][0]

    def series_for(entity):
        pts = [
            (int(r["Year"]), float(r[col]))
            for r in rows
            if r["Entity"] == entity and r.get(col)
        ]
        # FAO convention (documented in the country-level file, docs/methodology.md
        # and OWID): prevalence below 2.5% is reported as "<2.5%", exported as the
        # numeric floor 2.5. Flag those points so the chart can present the
        # reporting floor honestly (dashed line + "<2.5%" label) instead of an
        # apparently exact 2.5% every year. Applies to the Europe (FAO) aggregate.
        return [
            {"year": y, "value": r1(v), **({"below": True} if v == 2.5 else {})}
            for y, v in sorted(pts)
        ]

    regions = {
        "africa": "Africa (FAO)",
        "asia": "Asia (FAO)",
        "americas": "Americas (FAO)",
        "europe": "Europe (FAO)",
        "oceania": "Oceania (FAO)",
    }

    # World number series from World Bank WDI
    with open(os.path.join(RAW, "wb-world-undernourished.json"), encoding="utf-8") as fh:
        wb = json.load(fh)
    world_number = [
        {"year": int(d["date"]), "value": r1(d["value"] / 1e6)}
        for d in wb[1]
        if d["value"] is not None and int(d["date"]) >= 2000
    ]
    world_number.sort(key=lambda p: p["year"])

    meta_pou = {
        "publisher": "FAO",
        "dataset": "Prevalence of undernourishment, World and FAO regions (%)",
        "url": "https://ourworldindata.org/grapher/prevalence-of-undernourishment.csv",
        "republishedBy": "Our World in Data",
        "license": "CC BY 4.0 (OWID); underlying data (c) FAO",
        "referencePeriod": "2000-2024",
        "retrieved": RETRIEVED,
        "note": (
            "FAO reports '<2.5%' for prevalence below 2.5% (measurement floor); "
            "such points carry below=true. The Europe (FAO) aggregate sits "
            "below the floor in every year of this series."
        ),
    }
    meta_num = {
        "publisher": "FAO (via World Bank WDI)",
        "dataset": "Number of people undernourished, World (millions), SN.ITK.DEFC",
        "url": "https://api.worldbank.org/v2/country/WLD/indicator/SN.ITK.DEFC",
        "license": "CC BY 4.0 (World Bank)",
        "referencePeriod": "2001-2023",
        "retrieved": RETRIEVED,
    }
    meta_sofi = {
        "publisher": "FAO, IFAD, UNICEF, WFP, WHO",
        "dataset": "SOFI 2026 headline figures (2025 reference year)",
        "url": "https://www.fao.org/newsroom/detail/sofi-2026--hunger-not-inevitable--fao-says-as-global-hunger-report-shows-progress/en",
        "license": "(c) FAO, cited with attribution",
        "referencePeriod": "2025",
        "retrieved": RETRIEVED,
        "note": (
            "645 million people (7.8% of world population) faced hunger in 2025; "
            "nearly 14 million fewer than in 2024 and 43 million fewer than at "
            "the 2022 peak. FAO revises this series annually - values from "
            "different report vintages are not strictly comparable."
        ),
    }
    return {
        "metaPercent": meta_pou,
        "metaNumber": meta_num,
        "metaSofi2026": meta_sofi,
        "worldPercent": series_for("World"),
        "worldNumber": world_number,
        "sofi2026": {
            "percent": [{"year": 2025, "value": 7.8}],
            "number": [{"year": 2025, "value": 645}],
        },
        "regions": {key: series_for(entity) for key, entity in regions.items()},
    }


# --- 3. FAO Food Price Index ----------------------------------------------


def build_fpi():
    rows = read_csv_rows(os.path.join(MANUAL, "fao-food-price-index.csv"))
    series = [
        {"year": int(r["year"]), "value": float(r["value"])} for r in rows if r.get("year")
    ]
    series.sort(key=lambda p: p["year"])
    meta = {
        "publisher": "FAO",
        "dataset": "FAO Food Price Index, annual averages, nominal (2014-2016=100)",
        "url": "https://www.fao.org/worldfoodsituation/FoodPricesIndex/en",
        "license": "CC BY 4.0 (FAO)",
        "referencePeriod": "2000-2025",
        "retrieved": RETRIEVED,
        "note": (
            "Annual averages of the monthly index. 2024 (122.0) and 2025 (127.2) "
            "verified against FAO news releases; full verification trail in "
            "docs/sources.md. March 2022 monthly peak: 160.3 points."
        ),
    }
    return {"meta": meta, "series": series}


# --- 4. Acute food insecurity (GRFC) ---------------------------------------


def build_grfc():
    series_rows = read_csv_rows(os.path.join(MANUAL, "grfc-acute-food-insecurity.csv"))
    driver_rows = read_csv_rows(os.path.join(MANUAL, "grfc-drivers-2025.csv"))
    series = [
        {
            "year": int(r["year"]),
            "millions": float(r["millions"]),
            "countries": int(r["countries"]),
        }
        for r in series_rows
        if r.get("year")
    ]
    drivers = [
        {
            "driver": r["driver"],
            "millions": float(r["millions"]),
            "countries": int(r["countries"]),
        }
        for r in driver_rows
        if r.get("driver")
    ]
    meta = {
        "publisher": "Global Network Against Food Crises (GNAFC)",
        "dataset": "People facing high levels of acute food insecurity (IPC/CH Phase 3+)",
        "report": "2026 Global Report on Food Crises (published 2026-04-24)",
        "url": "https://www.fightfoodcrises.net/global-report-food-crises",
        "fullPdf": "https://reliefweb.int/attachments/81ec5beb-e188-402b-999b-9bdc3bfa62bf/cd9424en.pdf",
        "license": "(c) FAO, cited with attribution",
        "referencePeriod": "2016-2025 (2025 reference year for drivers)",
        "retrieved": RETRIEVED,
        "note": (
            "Year-to-year comparisons are affected by changing country coverage: "
            "the 2026 edition covers 47 countries/territories, the lowest in a "
            "decade. Driver attribution assigns one PRIMARY driver per country; "
            "driver populations overlap and must not be added together."
        ),
    }
    return {
        "meta": meta,
        "series": sorted(series, key=lambda p: p["year"]),
        "drivers2025": drivers,
    }


# --- 5. World map (Natural Earth, simplified) -------------------------------


def _dp_simplify(points, eps):
    """Iterative Douglas-Peucker. points: list of [x, y]."""
    n = len(points)
    if n < 3:
        return points
    keep = [False] * n
    keep[0] = keep[n - 1] = True
    stack = [(0, n - 1)]
    while stack:
        lo, hi = stack.pop()
        if hi <= lo + 1:
            continue
        ax, ay = points[lo]
        bx, by = points[hi]
        dx, dy = bx - ax, by - ay
        denom = (dx * dx + dy * dy) ** 0.5
        max_d, idx = -1.0, -1
        for i in range(lo + 1, hi):
            px, py = points[i]
            if denom == 0:
                d = ((px - ax) ** 2 + (py - ay) ** 2) ** 0.5
            else:
                d = abs(dy * (px - ax) - dx * (py - ay)) / denom
            if d > max_d:
                max_d, idx = d, i
        if max_d > eps:
            keep[idx] = True
            stack.append((lo, idx))
            stack.append((idx, hi))
    return [p for p, k in zip(points, keep) if k]


def _clean_ring(ring, eps):
    """Simplify, round to 2 decimals and drop consecutive duplicates."""
    simplified = _dp_simplify(ring, eps)
    out = []
    for x, y in simplified:
        pt = [round(x, 2), round(y, 2)]
        if not out or out[-1] != pt:
            out.append(pt)
    # drop degenerate ring
    if len(out) >= 2 and out[0] == out[-1]:
        out = out[:-1]
    return out if len(out) >= 3 else None


def build_map(eps=0.1):
    with open(os.path.join(RAW, "ne_50m_admin_0_countries.geojson"), encoding="utf-8") as fh:
        gj = json.load(fh)

    a3_to_a2 = {}
    features = []
    for feat in gj["features"]:
        props = feat["properties"]
        code = props.get("ISO_A3") or props.get("ADM0_A3")
        if code in (None, "-99", ""):
            code = props.get("ADM0_A3")
        if code in (None, "-99", ""):
            continue
        code = NE_CODE_FIXES.get(code, code)
        a2 = props.get("ISO_A2")
        # accept only clean 2-letter codes; Natural Earth uses composite codes
        # such as "CN-TW" for some disputed territories
        if not (isinstance(a2, str) and len(a2) == 2 and a2.isalpha() and a2.isupper()):
            a2 = None
        if a2 is None:
            a2 = A3_TO_A2_EXTRA.get(code)
        if a2:
            a3_to_a2[code] = a2
        name = props.get("NAME_LONG") or props.get("NAME") or code
        geom = feat["geometry"]
        new_geom = {"type": geom["type"], "coordinates": []}
        if geom["type"] == "Polygon":
            rings = []
            for ring in geom["coordinates"]:
                cleaned = _clean_ring(ring, eps)
                if cleaned:
                    rings.append(cleaned)
            if rings:
                new_geom["coordinates"] = rings
        elif geom["type"] == "MultiPolygon":
            polys = []
            for poly in geom["coordinates"]:
                rings = []
                for ring in poly:
                    cleaned = _clean_ring(ring, eps)
                    if cleaned:
                        rings.append(cleaned)
                if rings:
                    polys.append(rings)
            new_geom["coordinates"] = polys
        else:
            continue
        if not new_geom["coordinates"]:
            continue
        features.append(
            {
                "type": "Feature",
                "properties": {"code": code, "name": name},
                "geometry": new_geom,
            }
        )

    for code, a2 in A3_TO_A2_EXTRA.items():
        if a2 and code not in a3_to_a2:
            a3_to_a2[code] = a2

    meta = {
        "publisher": "Natural Earth",
        "dataset": "Admin 0 - Countries (1:50m), simplified",
        "url": "https://www.naturalearthdata.com/downloads/50m-cultural-vectors/",
        "license": "Public domain (NOAA/The Natural Earth project)",
        "retrieved": RETRIEVED,
        "note": "Geometric simplification (Douglas-Peucker, 0.1 degree tolerance)",
    }
    return {"type": "FeatureCollection", "meta": meta, "features": features}, a3_to_a2


# --- 6. Write outputs -------------------------------------------------------


def write_json(name, payload):
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, name)
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(payload, fh, ensure_ascii=False, separators=(",", ":"))
        fh.write("\n")
    kb = os.path.getsize(path) / 1024
    print(f"  wrote {name}: {kb:.0f} KB")
    return path


def main() -> int:
    print("Building public/data/*.json ...")

    pou = build_pou_country()
    world_map, a3_to_a2 = build_map()
    # attach alpha-2 codes for localized country names (Intl.DisplayNames)
    for c in pou["countries"]:
        c["a2"] = a3_to_a2.get(c["code"])

    missing_a2 = [c["code"] for c in pou["countries"] if not c.get("a2")]
    map_codes = {f["properties"]["code"] for f in world_map["features"]}
    unmatched = sorted(c["code"] for c in pou["countries"] if c["code"] not in map_codes)

    write_json("pou-country.json", pou)
    write_json("trend.json", build_trend())
    write_json("food-price-index.json", build_fpi())
    write_json("acute-food-insecurity.json", build_grfc())
    write_json("world-map.json", world_map)

    print(f"  countries with data: {len(pou['countries'])}")
    print(f"  map features: {len(world_map['features'])}")
    print(f"  data countries WITHOUT a map polygon: {unmatched}")
    print(f"  data countries WITHOUT an ISO-A2 code: {missing_a2}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
