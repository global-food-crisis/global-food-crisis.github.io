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
            "referenceYear": 2023, "retrieved": "2026-10-15", "note": "..." },
  "countries": [
    {
      "code": "AFG",        // ISO 3166-1 alpha-3 — join key
      "name": "Afghanistan",// English display name (matches GeoJSON)
      "year": 2023,         // statistical reference year of the value
      "value": 28.1,        // prevalence, percent (2.5 = FAO floor when below=true)
      "below": false,       // true → FAO reports "<2.5%", value is the floor
      "stale": false,       // true → assessment too old to map (pre-2019)
      "a2": "AF"            // ISO alpha-2 — key for Intl.DisplayNames
    }
  ]
}
```

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
    "asia":     [...], "americas": [...], "europe": [...], "oceania": [...]
  }
}
```

## acute-food-insecurity.json

GRFC 2026 acute series + 2025 primary drivers (Chapters 2, 4, 5).

```json
{
  "meta":        { ...provenance, "fullPdf": "...", "referencePeriod": "2025" },
  "series":      [ { "year": 2016, "millions": 105.3, "countries": 48 }, ... ],
  "drivers2025": [
    { "driver": "Conflict and insecurity", "millions": 147.4, "countries": 19 },
    { "driver": "Weather extremes",        "millions": 87.5,  "countries": 16 },
    { "driver": "Economic shocks",         "millions": 29.8,  "countries": 12 }
  ]
}
```

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

- `data/raw/prevalence-of-undernourishment.csv` — OWID grapher CSV (FAO SDG 2.1.1)
- `data/raw/wb-world-undernourished.json` — World Bank WDI API response (SN.ITK.DEFC)
- `data/raw/ne_50m_admin_0_countries.geojson` — Natural Earth admin-0 boundaries
- `data/manual/grfc-acute-food-insecurity.csv` — GRFC series 2016–2025, manually compiled from GRFC 2026 press release/PDF with per-row provenance
- `data/manual/grfc-drivers-2025.csv` — GRFC 2025 primary-driver table
- `data/manual/fao-food-price-index.csv` — FAO FPI annual values, anchor-verified (see limitations.md)
