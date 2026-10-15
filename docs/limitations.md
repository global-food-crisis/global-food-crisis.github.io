# Limitations and open questions

Honest accounting of what this site can and cannot claim.

## Data coverage and comparability

- **Country map vintage is 2023, not 2025.** Country-level PoU in
  FAOSTAT/OWID is published with a longer lag than the global SOFI headline;
  most countries' latest full assessment is 2023 (166 of 170 in the file).
  The world and regional totals quoted elsewhere refer to 2025 (SOFI 2026).
  The page labels both vintages explicitly.
- **63 countries are "<2.5%", not zero.** FAO's reporting floor. The map
  shades them into the lowest class rather than implying a precise value.
- **Two stale assessments are greyed out** (Cuba, latest 2006; and one
  2018/2021 value). Grey means "no recent assessment", not "no hunger" —
  most notably the Sudan, whose latest chronic estimate predates the 2023
  war. Its current crisis appears only through acute-hunger indicators.
- **Four data countries have no polygon** at the map's resolution
  (Barbados, Macao, Malta, Seychelles). They carry data and appear in the
  table.
- **GRFC coverage changes every year** — 47 comparable countries in 2025,
  the lowest in a decade, with 18 food-crisis countries lacking data
  entirely. Part of the 2024→2025 decline in the acute series reflects lost
  coverage, not only real improvement. The chart prints the country count
  under each bar for this reason.
- **The acute series is not a world total** and must never be added to the
  chronic-hunger indicators (different constructs, populations, windows).
- **FAO revises its series annually.** The 2025 SOFI point (7.8%, 645M) is
  the newest vintage and is drawn as an isolated marker rather than joined
  to the 2000–2024 OWID-republished line.
- **SOFI/GRFC projections** (2030 hunger ≈ 520M; aid-decline projections)
  are model-based scenarios, not observations; they are labeled as such.

## Pipeline constraints discovered during research

- **FAO bulk downloads were Cloudflare-blocked** from the build
  environment. The Food Price Index series was therefore compiled from
  FAO-published anchor values (2008, 2011, 2020–2025 annual averages, the
  March 2022 monthly peak of 160.3) cross-verified against FAO releases
  into `data/manual/fao-food-price-index.csv`. Before republishing or
  extending the FPI chart, re-verify against
  https://www.fao.org/worldfoodsituation/FoodPricesIndex/en — the file is
  marked accordingly.
- **GRFC figures** were compiled from the 2026 press release and full PDF
  (retrieved 2026-10-15) into `data/manual/*.csv`. If GRFC publishes a
  Mid-Year Update, refresh these files before citing "current" numbers.
- **OWID is a republisher**: values can differ slightly from FAO's own
  current website as each revises. Our convention: latest SOFI for
  headline/region numbers, OWID-republished series for history and the map.

## Site behavior

- **JavaScript is required for charts, map, search, tables and language
  switching.** The narrative, headlines and all source notes are
  server-rendered and remain readable without JS; data is also available as
  static CSV. Full no-JS parity (static tables in HTML) is a v2 candidate.
- **Accessibility is designed to WCAG 2.2 AA but not formally audited** with
  assistive technology. We claim a design target, not certified compliance.
- **Language coverage**: English (default) + Traditional Chinese. Country
  names rely on the browser's `Intl.DisplayNames` (broad but not identical
  across platforms; English fallback included).
- **No cookies, no analytics** — the only client-side persistence is the
  language preference in localStorage (`gfc.language`).
- **Chart canvas contents are not keyboard-navigable**; each chart has a
  text alternative (table or figure caption) instead, which is the accepted
  pattern for complex data graphics.

## Unverified or deliberately omitted

- Country-level moderate/severe food insecurity (FIES) choropleth — FAOSTAT
  bulk download blocked from this environment; only global/summary FIES
  values are quoted. A v2 map layer could add it once bulk access works.
- WFP operational reach is described conservatively ("over 100 million
  people in recent years") rather than with a precise annual figure, which
  changes with each annual report.
- Amartya Sen's entitlement framing (Chapter 1) is cited as an analytic
  tradition, not as a statistic.
- No famine-risk projections are displayed beyond quoting IPC's confirmed
  classifications.

## Open questions for Chapter 02

- Add FIES country-level map and child-malnutrition (wasting/stunting)
  indicators when bulk data access is reliable.
- Re-assess whether GRFC's 2026 comparable-coverage series or the
  non-comparable full series better serves readers (currently the
  comparable series, as GRFC itself presents it).
- Consider a per-statistic citation widget (hover/tap the number → source
  card) now that every claim has a row in `docs/sources.md`.
