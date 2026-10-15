# Methodology

How the numbers on this site are defined, chosen, transformed and displayed.
Companion documents: [`sources.md`](sources.md) (evidence table),
[`data-dictionary.md`](data-dictionary.md) (file schemas),
[`limitations.md`](limitations.md) (known caveats).

## Editorial rules

1. **Reference year, not publication year.** Each statistic states the year
   its data describe. SOFI 2026 (published 2026-07-21) mostly reports on
   2025; GRFC 2026 (published 2026-04-24) reports on 2025; the country map
   refers to the 2023 assessment round (latest available for most
   countries). Different vintages are labeled wherever they appear and are
   never mixed silently.
2. **Indicators are never summed.** Undernourishment (SDG 2.1.1), FIES-based
   food insecurity (SDG 2.1.2), and IPC/CH acute food insecurity measure
   different constructs over different populations and time windows. Chapter
   2 keeps them in separate cards with an explicit "never add" warning.
3. **Counts vs shares are both shown.** The percentage of the world that is
   hungry has fallen further than the absolute number (population grew);
   Chapter 5 lets the reader switch views and explains the difference.
4. **Correlation is not causation.** Every driver section in Chapter 4
   carries a caveat box describing what the evidence does and does not
   support.
5. **No live counters.** Hunger statistics are annual estimates, not
   real-time measurements — the site never animates a number that implies
   otherwise.
6. **Projections are labeled as projections** (SOFI's ~520 million for 2030;
   aid-decline projections) and never blended with observed series.

## Indicator definitions (as used on the site)

- **Prevalence of undernourishment (PoU, SDG 2.1.1)** — share of the
  population whose habitual dietary energy consumption is insufficient to
  maintain a normal, active and healthy life. Modeled by FAO from Food
  Balance Sheets + food-access distribution data. Countries below 2.5% are
  reported by FAO as "<2.5%" — the site preserves that floor rather than
  showing a false-precision 0.x%. The same convention applies to the FAO
  regional aggregates: the Europe series sits below the floor in every
  year, so the Chapter 5 trend chart draws it as a dashed line at 2.5%
  labelled "<2.5%" (data points carry `below: true` in trend.json) — a
  reporting floor, not an exact observation.
- **FAO Food Price Index (FFPI)** — a measure of the monthly change in
  international prices of a basket of food commodities (cereals, vegetable
  oils, dairy, meat and sugar), weighted by their average 2014–2016 export
  shares, with the 2014–2016 average set to 100 (FAO definition). The site
  charts **annual averages** of the monthly index. It measures world
  export prices, not retail or household food costs — Chapter 4 states
  this and the base-period reading rule (125 ≈ 25% above the 2014–2016
  baseline, not +25% versus the previous year) in the chart explainer.
- **Moderate/severe food insecurity (FIES, SDG 2.1.2)** — share of the
  population reporting limited, uncertain or inadequate access to food over
  the previous 12 months, from direct survey experience questions scaled
  into national estimates.
- **Acute food insecurity (IPC/CH Phase 3+)** — people in food *Crisis* or
  worse within populations assessed by the IPC / Cadre Harmonisé consensus
  process. Only monitored food-crisis countries are included — it is **not**
  a world total.
- **Famine (IPC Phase 5)** — a technical classification requiring ≥20% of
  households with extreme food gaps, >30% child acute malnutrition, and
  crude death rate >2/10,000/day, validated by an IPC Famine Review
  Committee.

## Data processing pipeline

1. **Download** (`scripts/download_data.py`): fetches the OWID grapher CSV
   for SDG 2.1.1, the World Bank WDI API for SN.ITK.DEFC, and the Natural
   Earth GeoJSON into `data/raw/`. GRFC and FPI values are stored as
   manually compiled CSVs in `data/manual/` with per-value provenance (see
   sources.md for why FAO/GRFC bulk downloads were not automatable from
   this environment).
2. **Process** (`scripts/process_data.py`, pandas): normalizes country codes
   to ISO alpha-3 (dropping OWID aggregate entities like regions/continents
   from the country file), takes each country's latest non-stale assessment
   (2023 for 166 of 170 countries), computes the world/region series, joins
   country values onto map polygons (97.6% join coverage), and writes
   `public/data/*.json` with embedded provenance blocks.
3. **Validate** (`scripts/validate_data.py`): 19,705 checks — code format,
   year ranges, value ranges (0–100% for prevalence), join coverage,
   series continuity, JSON parseability, provenance completeness. The build
   fails on any failure.
4. **Export CSV** (`scripts/export_csv.py`): writes the Chapter 5 download
   file with embedded source comments.

## Display conventions

- **Map classes**: <2.5% (FAO floor), 2.5–5%, 5–10%, 10–20%, 20–35%, ≥35%.
  Stale assessments (Cuba 2006, one 2018/2021 value) are greyed out as
  "no recent assessment" rather than mapped — e.g. the Sudan's latest
  chronic estimate predates the 2023 war, so its current crisis is
  represented through the acute-hunger indicators instead.
- **Trend chart**: the OWID-republished series (2000–2024) is drawn as a
  line; the SOFI 2026 point (2025) is an isolated labeled marker — the
  newest vintage is deliberately not spliced into the older series, because
  FAO revises the series every year.
- **Acute chart**: each bar carries its assessed-country count, because
  GRFC coverage changes year to year (47 countries in 2025, the lowest in a
  decade) and the 2024→2025 decline partly reflects lost coverage.
- **Localization**: interface copy comes from `src/i18n/{en,zh-TW}.ts`;
  country names render through the browser's `Intl.DisplayNames` (falls
  back to the English name); numbers format per locale (zh-TW uses
  億/萬 units, en uses millions).

## Why the numbers may differ from other publications

- Different SOFI editions use revised population/food-balance inputs; this
  site quotes the newest (SOFI 2026) vintages and the OWID-republished
  historical series, which differ slightly from older reports.
- The acute-food-insecurity series reflects GRFC's comparable-coverage
  methodology, which they themselves restate each year.
- Small differences between vintages are normal and are not "errors";
  our rule is to label the vintage on every number.

## Accessibility approach

- Semantic landmarks (header/nav/main/section/footer), heading hierarchy,
  skip link, `aria-current` on active chapter, `aria-pressed` on toggles,
  `aria-expanded` on accordions.
- Every ECharts visualization renders inside `role="img"` with a
  descriptive `aria-label`, and each chapter provides a data-table
  alternative (and a CSV download for the trend).
- `prefers-reduced-motion` disables reveal animations, scroll cues and
  chart animations (live-updated via `matchMedia`).
- Color palette checked for WCAG AA contrast on the dark background;
  choropleth classes additionally differ in lightness, not only hue.
- The story text is server-rendered, so it is readable before (and without)
  JavaScript; charts and tables require JS but degrade to labeled loading
  states and retry buttons on failure.
