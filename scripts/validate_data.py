#!/usr/bin/env python3
"""validate_data.py — Integrity checks for the static data files.

Validates every file in public/data/ against schema and sanity rules:
JSON parses, expected key structure, value ranges, year coverage, code
formats, geometry bounds, and data/map join coverage. Exits non-zero on
any failure so it can gate CI deployments.

Usage:
    python3 scripts/validate_data.py
"""

import json
import os
import re
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(BASE, "public", "data")

FAILURES = []
CHECKS = 0

A3 = re.compile(r"^[A-Z]{3}$")
A2 = re.compile(r"^[A-Z]{2}$")


def check(condition, message):
    global CHECKS
    CHECKS += 1
    if not condition:
        FAILURES.append(message)


def load(name):
    with open(os.path.join(DATA, name), encoding="utf-8") as fh:
        return json.load(fh)


def validate_pou():
    d = load("pou-country.json")
    check("meta" in d and "countries" in d, "pou-country.json: missing top-level keys")
    check("retrieved" in d.get("meta", {}), "pou-country.json: meta.retrieved missing")
    check("url" in d.get("meta", {}), "pou-country.json: meta.url missing")
    countries = d["countries"]
    check(len(countries) >= 150, f"pou-country.json: too few countries ({len(countries)})")
    codes = set()
    for c in countries:
        code = c.get("code", "")
        check(A3.match(code), f"pou-country.json: bad ISO-A3 code {code!r}")
        check(code not in codes, f"pou-country.json: duplicate code {code}")
        codes.add(code)
        check(0 < c.get("value", -1) <= 100, f"pou-country.json: value out of range for {code}")
        if c.get("stale"):
            check(c["year"] < 2021, f"pou-country.json: stale flag but recent year for {code}")
        else:
            check(c.get("year") in (2021, 2022, 2023),
                  f"pou-country.json: unexpected year for {code}")
        check(bool(c.get("name")), f"pou-country.json: missing name for {code}")
        check(
            c.get("a2") is None or A2.match(c.get("a2", "")),
            f"pou-country.json: bad a2 for {code}",
        )
    below = [c for c in countries if c.get("below")]
    check(all(c["value"] == 2.5 for c in below), "pou-country.json: below flag on value != 2.5")
    print(f"  pou-country.json: {len(countries)} countries "
          f"({len(below)} reported as '<2.5%')")


def validate_trend():
    d = load("trend.json")
    for key in ("worldPercent", "worldNumber", "sofi2026", "regions"):
        check(key in d, f"trend.json: missing {key}")

    wp = d["worldPercent"]
    years = [p["year"] for p in wp]
    check(years == sorted(years), "trend.json: worldPercent years not sorted")
    check(years[0] <= 2000 and years[-1] >= 2024, "trend.json: worldPercent period unexpected")
    check(all(0 < p["value"] <= 100 for p in wp), "trend.json: worldPercent value out of range")

    wn = d["worldNumber"]
    years = [p["year"] for p in wn]
    check(years == sorted(years), "trend.json: worldNumber years not sorted")
    check(all(0 < p["value"] < 1000 for p in wn), "trend.json: worldNumber value out of range")

    s26 = d["sofi2026"]
    check(s26["percent"] == [{"year": 2025, "value": 7.8}], "trend.json: sofi2026 percent wrong")
    check(s26["number"] == [{"year": 2025, "value": 645}], "trend.json: sofi2026 number wrong")

    regions = d["regions"]
    check(set(regions) == {"africa", "asia", "americas", "europe", "oceania"},
          "trend.json: unexpected region set")
    for name, pts in regions.items():
        check(len(pts) >= 20, f"trend.json: region {name} too short ({len(pts)})")
        check(all(0 < p["value"] <= 100 for p in pts), f"trend.json: region {name} value range")
    # latest world value consistency with SOFI reporting
    check(abs(wp[-1]["value"] - 8.2) < 0.01, "trend.json: world 2024 percent changed")
    print(f"  trend.json: {len(wp)} world percent points ({wp[0]['year']}-{wp[-1]['year']}), "
          f"{len(wn)} number points, {len(regions)} regions")


def validate_fpi():
    d = load("food-price-index.json")
    series = d["series"]
    years = [p["year"] for p in series]
    check(years == list(range(2000, 2026)), "food-price-index.json: years not 2000-2025 continuous")
    check(all(40 < p["value"] < 200 for p in series), "food-price-index.json: value out of range")
    peak = max(p["value"] for p in series)
    peak_year = [p["year"] for p in series if p["value"] == peak][0]
    check(peak_year == 2022, "food-price-index.json: peak not in 2022")
    print(f"  food-price-index.json: {len(series)} annual values, peak {peak} in {peak_year}")


def validate_grfc():
    d = load("acute-food-insecurity.json")
    series = d["series"]
    years = [p["year"] for p in series]
    check(years == list(range(2016, 2026)), "grfc: years not 2016-2025 continuous")
    check(all(50 < p["millions"] < 400 for p in series), "grfc: millions out of range")
    check(all(40 <= p["countries"] <= 65 for p in series), "grfc: countries count out of range")
    check(series[-1]["millions"] == 265.7 and series[-1]["countries"] == 47,
          "grfc: 2025 values wrong")
    drivers = d["drivers2025"]
    check(len(drivers) == 3, "grfc: expected 3 primary drivers")
    by = {x["driver"]: x for x in drivers}
    check(by.get("Conflict and insecurity", {}).get("millions") == 147.4, "grfc: conflict driver")
    check(by.get("Weather extremes", {}).get("millions") == 87.5, "grfc: weather driver")
    check(by.get("Economic shocks", {}).get("millions") == 29.8, "grfc: economic driver")
    total = sum(x["millions"] for x in drivers)
    check(abs(total - 265.7) <= 10,
          "grfc: primary-driver attribution should cover roughly the total "
          "(one primary driver per country; small residue from contexts "
          "without attribution)")
    print(f"  acute-food-insecurity.json: {len(series)} years, 3 drivers "
          f"({total:.1f}M attributed - nearly disjoint, one primary driver per country)")


def validate_map():
    m = load("world-map.json")
    check(m.get("type") == "FeatureCollection", "world-map.json: not a FeatureCollection")
    feats = m.get("features", [])
    check(len(feats) >= 180, f"world-map.json: too few features ({len(feats)})")
    codes = set()
    for f in feats:
        props = f.get("properties", {})
        code = props.get("code", "")
        check(A3.match(code), f"world-map.json: bad feature code {code!r}")
        check(code not in codes, f"world-map.json: duplicate code {code}")
        codes.add(code)
        geom = f.get("geometry", {})
        coords = geom.get("coordinates", [])
        polys = coords if geom["type"] == "MultiPolygon" else [coords]
        for poly in polys:
            for ring in poly:
                check(len(ring) >= 3, f"world-map.json: degenerate ring in {code}")
                for x, y in ring:
                    check(-180.5 <= x <= 180.5 and -90.5 <= y <= 90.5,
                          f"world-map.json: coordinate out of bounds in {code}")

    pou = load("pou-country.json")
    data_codes = {c["code"] for c in pou["countries"]}
    unmatched = data_codes - codes
    coverage = 1 - len(unmatched) / len(data_codes)
    check(coverage >= 0.95, f"world-map.json: data/map join coverage too low ({coverage:.1%})")
    print(f"  world-map.json: {len(feats)} features, join coverage {coverage:.1%}, "
          f"no polygon for: {sorted(unmatched)}")


def main() -> int:
    print("Validating public/data/ ...")
    for fn in (validate_pou, validate_trend, validate_fpi, validate_grfc, validate_map):
        fn()
    print(f"\n{CHECKS} checks run, {len(FAILURES)} failures")
    for f in FAILURES:
        print(f"  FAIL: {f}")
    return 1 if FAILURES else 0


if __name__ == "__main__":
    sys.exit(main())
