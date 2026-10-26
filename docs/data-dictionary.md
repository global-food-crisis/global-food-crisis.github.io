# Data dictionary

Schemas of every processed file the site consumes. All files live in
`public/data/`. Every file embeds a `meta` block with publisher, dataset,
URL, license, reference period/year and retrieval date (2026-10-15).

## pou-country.json

Country-level undernourishment prevalence (Chapter 3 map, search, table).

```json
{
  "meta": { "publisher": "...", "dataset": "...", "url": "...",
            "republishedBy": "...", "license": "...",
            "sourceEdition": "FAO 2025 edition, as republished by Our World in Data",
            "sourceUpdated": "2026-02-25",
            "averagingPeriod": "country values are three-year averages",
            "referenceYear": "latest available per country (2023 for 166 of 170; ...)",
            "retrieved": "2026-10-15", "note": "..." },
  "countries": [
    {
      "code": "AFG",        // ISO 3166-1 alpha-3 — join key
      "name": "Afghanistan",// English display name (matches GeoJSON)
      "year": 2023,         // statistical reference year of the value
      "value": 28.1,        // prevalence, percent (2.5 = FAO floor when below=true)
      "below": false,       // true → FAO reports "<2.5%", value is the floor
      "stale": false,       // true → too old / pre-disruption (pre-2021 rounds, or SDN 2021 pre-war); greyed on the map, archived value kept in the table
      "a2": "AF"            // ISO alpha-2 — key for Intl.DisplayNames
    }
  ]
}
```

`stale` entries currently: CUB (2006), PRK (2018), SDN (2021 — predates the
April 2023 war, excluded per `PRE_DISRUPTION_NO_CURRENT` in
`scripts/process_data.py`).

## world-map.json

GeoJSON `FeatureCollection` (Natural Earth, simplified). Each feature:

```json
{
  "type": "Feature",
  "properties": { "code": "ZWE", "name": "Zimbabwe" }, // code = ISO alpha-3
  "geometry": { "type": "Polygon", "coordinates": [...] }
}
```

Four data countries have no polygon at this resolution (BRB, MAC, MLT, SYC);
they appear only in the table — noted on the page.

## trend.json

Chapter 5 (TrendChart + table + CSV export).

```json
{
  "metaPercent":  { ...provenance for the % series... },
  "metaNumber":   { ...provenance for the count series... },
  "metaSofi2026": { ...provenance + note for the newest point... },
  "worldPercent": [ { "year": 2000, "value": 12.7 }, ... ],   // 2000–2024
  "worldNumber":  [ { "year": 2001, "value": 803.0 }, ... ],  // 2001–2023
  "sofi2026":     { "percent": [ { "year": 2025, "value": 7.8 } ],
                    "number":  [ { "year": 2025, "value": 645 } ] },
  "regions": {
    "africa":   [ { "year": 2000, "value": 22.1 }, ... ], // percent, 2000–2024
    "asia":     [...], "americas": [...], "oceania": [...],
    "europe":   [ { "year": 2000, "value": 2.5, "below": true }, ... ]
    // "below": true → FAO "<2.5%" reporting floor (Europe is below the
    // floor in every year): the value 2.5 is the floor, not an exact
    // observation. The chart draws such series dashed and labels them
    // "<2.5%" — see docs/methodology.md.
  }
}
```

## acute-food-insecurity.json

GRFC 2026 acute series + 2025 primary drivers (Chapters 2, 4, 5).

```json
{
  "meta":        { ...provenance, "fullPdf": "...", "referencePeriod": "2016-2025 (2025 reference year for drivers)" },
  "series":      [ { "year": 2016, "millions": 105.3, "countries": 48 }, ... ],
  "drivers2025": [
    { "driver": "Conflict and insecurity", "millions": 147.4, "countries": 19 },
    { "driver": "Weather extremes",        "millions": 87.5,  "countries": 16 },
    { "driver": "Economic shocks",         "millions": 29.8,  "countries": 12 }
  ]
}
```

Locators: series = GRFC 2026 Figure 2.7 (print p. 26); drivers = §2.4,
Figures 2.5 (p. 22) and 2.6 (p. 25). The three driver populations sum to
264.7M vs the 265.7M total (separately assessed displaced groups whose
primary driver differs are excluded from the breakdown).

## food-price-index.json

FAO Food Price Index annual averages (Chapter 4 economic driver).

```json
{
  "meta":   { ...provenance, "note": "2014–2016 = 100" },
  "series": [ { "year": 2000, "value": 53.7 }, ... ]  // 2000–2025
}
```

## trend.csv

The Chapter 5 download. Header comments state the sources; columns:

| Column | Type | Meaning |
| --- | --- | --- |
| `year` | int | reference year |
| `world_share_percent` | float | world prevalence of undernourishment, % |
| `world_number_millions` | float/empty | world number of undernourished, millions (blank before 2001) |
| `note` | string | "SOFI 2026 (newest vintage)" on the 2025 row, else empty |

## Raw inputs (not consumed by the site directly)

- `data/raw/prevalence-of-undernourishment.csv` — OWID grapher CSV (FAO SDG 2.1.1, FAO 2025 edition, updated 2026-02-25)
- `data/raw/wb-world-undernourished.json` — World Bank API response (SN.ITK.DEFC, Health Nutrition and Population Statistics; underlying data FAO)
- `data/raw/ne_50m_admin_0_countries.geojson` — Natural Earth admin-0 boundaries
- `data/manual/grfc-acute-food-insecurity.csv` — GRFC series 2016–2025 (Figure 2.7, p. 26), manually compiled from GRFC 2026 press release/PDF with per-row provenance
- `data/manual/grfc-drivers-2025.csv` — GRFC 2025 primary-driver table (§2.4, Figures 2.5–2.6)
- `data/manual/fao-food-price-index.csv` — FAO FPI annual values; 2009–2025 verified against Food Outlook June 2026 Table 4.4, 2000–2008 FAO-derived and not independently re-verified (see limitations.md)
