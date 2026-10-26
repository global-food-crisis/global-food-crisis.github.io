# Global Food Crisis — Chapter 01

## The World Has Food. Why Does Hunger Persist?

An open, evidence-based, bilingual (English / 繁體中文) interactive data story about
global hunger: its scale, its geography, its causes, its trend — and what one
person can realistically do about it.

The site guides visitors through six chapters — **Awareness → Understanding →
Exploration → Action**:

1. **The Question** — the world produces enough calories, yet 645 million people faced hunger in 2025. Why?
2. **The Scale** — four different indicators (undernourishment, FIES, IPC/CH, famine) that must never be confused or added together.
3. **The Geography** — an interactive world choropleth of undernourishment prevalence with an accessible data-table alternative.
4. **The Causes** — conflict, poverty, climate extremes and economic shocks, each with evidence, case studies and caveats.
5. **The Trend** — 25 years of global progress and reversal, plus the acute-crisis series since 2016.
6. **The Action** — interest-based recommendations with verified resources and honest caveats (no guilt-tripping, no false claims).

Every statistic on the site carries its source, its **statistical reference
year** (not the publication year), and its limitations. See
[`docs/sources.md`](docs/sources.md) for the full evidence table.

---

## Design principles

- **Factual accuracy first.** No invented numbers, no mixed indicators, no
  unlabeled estimates. Different data vintages are labeled, never blended.
- **Static by design.** No backend, no database, no runtime third-party APIs,
  no tracking, no analytics, no cookies. All data ships as versioned static
  JSON/CSV files in `public/data/`.
- **Bilingual.** English and Traditional Chinese (繁體中文) with a persistent,
  localStorage-based language switch. Country names localize through the
  browser's `Intl.DisplayNames`.
- **Accessible.** Semantic HTML, keyboard-navigable interactions, visible
  focus, data-table alternatives for every chart, `prefers-reduced-motion`
  support, and explicit no-data states. (WCAG 2.2 AA is the design target; no
  formal compliance claim is made without testing.)
- **Works everywhere.** Relative/base-path-aware asset URLs so the site works
  at a domain root **and** under `https://USERNAME.github.io/REPOSITORY_NAME/`.

## Quick start (local development)

Requirements: Node.js 20+ (or [Bun](https://bun.sh) 1.1+) and Python 3.10+.

```bash
bun install            # or: npm install
bun run dev            # or: npm run dev  → http://localhost:3000
```

Useful scripts:

| Command | Purpose |
| --- | --- |
| `bun run dev` | Development server with hot reload |
| `bun run lint` | ESLint (Next.js + React rules) |
| `bun run validate:i18n` | i18n structural parity check (en ↔ zh-TW) |
| `python3 scripts/validate_data.py` | Data integrity validation (19,718 checks) |
| `python3 scripts/inspect_data.py` | Quick structural summary of `public/data/*.json` |
| `python3 scripts/export_csv.py` | Regenerate the Chapter 5 download CSV |
| `bun run build:export` | Static export for GitHub Pages (see below) |

## The data pipeline

All datasets are downloaded/processed by reproducible scripts — no numbers are
hand-entered into the site.

```
scripts/download_data.py   → fetches raw datasets into data/raw/ and data/manual/
scripts/process_data.py    → transforms raw data into public/data/*.json (+ world-map.json)
scripts/validate_data.py   → integrity checks (country codes, years, ranges, join coverage)
scripts/export_csv.py      → writes public/data/trend.csv (the Chapter 5 download)
```

Processed files consumed by the site:

| File | Content | Source |
| --- | --- | --- |
| `public/data/pou-country.json` | Undernourishment prevalence by country (170 countries, 2023 vintage) | FAO (SDG 2.1.1) via Our World in Data |
| `public/data/trend.json` | World share 2000–2024, world number 2001–2023, regional series, SOFI 2026 point | FAO via OWID; World Bank HNP Statistics (SN.ITK.DEFC); SOFI 2026 |
| `public/data/acute-food-insecurity.json` | IPC/CH Phase 3+ series 2016–2025 + 2025 primary-driver stats | GRFC 2026 |
| `public/data/food-price-index.json` | FAO Food Price Index, annual 2000–2025 | FAO |
| `public/data/world-map.json` | World boundaries GeoJSON with ISO alpha-3 codes | Natural Earth (public domain) |
| `public/data/trend.csv` | Chapter 5 download file | derived from trend.json |

To refresh the data (e.g., after FAO publishes new estimates):

```bash
python3 scripts/download_data.py     # re-fetch raw inputs
python3 scripts/process_data.py      # re-derive public/data/*.json
python3 scripts/validate_data.py     # must pass with 0 failures
python3 scripts/export_csv.py
bun run validate:i18n
```

Then update the statistics and reference years in `src/i18n/en.ts` and
`src/i18n/zh-TW.ts` **together**, citing the new source in
`docs/sources.md`. Never update one language only.

## Repository structure

```
├── src/app/                    # Next.js App Router (single page: page.tsx, layout.tsx, globals.css)
├── src/components/
│   ├── sections/               # The six chapters (Hero, Scale, Geography, Causes, Trend, Action)
│   ├── charts/                 # ECharts modules (WorldMap, TrendChart, AcuteChart, DriversChart, PriceIndexChart, BaseChart)
│   ├── Header.tsx / Footer.tsx # Site chrome, language switch, disclaimer
│   └── Reveal.tsx / SourceNote.tsx
├── src/i18n/                   # en.ts, zh-TW.ts, provider (all user-facing copy)
├── src/lib/                    # basePath, lazy JSON loading, formatting, site config
├── public/data/                # Versioned static datasets (JSON + CSV)
├── scripts/                    # Python data pipeline + diagnostics (validate / process / export / inspect)
├── docs/                       # sources.md, methodology.md, data-dictionary.md, limitations.md
├── tests/                      # i18n parity + chart-logic tests (bun) and the tsc known-issue baseline
├── .github/workflows/deploy.yml        # Validate → static export → GitHub Pages (push to main)
├── .github/workflows/pr-validation.yml # Same gates on pull requests; never deploys
└── data/raw/, data/manual/     # Raw inputs retained for reproducibility
```

## Deploying to GitHub Pages

The included workflow (`.github/workflows/deploy.yml`) runs on every push to
`main`:

1. **Validates** — i18n parity (Bun) and data integrity (Python, stdlib only).
2. **Builds** — `NEXT_OUTPUT=export` static export with
   `NEXT_PUBLIC_BASE_PATH=/<repository-name>` set automatically, so all
   runtime data fetches resolve under the project sub-path.
3. **Deploys** — uploads `out/` via the official GitHub Pages actions.

Pull requests targeting `main` are validated separately by
[`.github/workflows/pr-validation.yml`](.github/workflows/pr-validation.yml):
the same lint / i18n / logic / data gates, the same static export build
(never published), plus an explicit TypeScript check compared against the
documented known-issue baseline
([`tests/typescript-baseline.txt`](tests/typescript-baseline.txt)). The PR
workflow runs with read-only permissions and no secrets.

One-time repository setup:

1. Push this repository to GitHub (branch `main`).
2. **Repository → Settings → Pages → Source: "GitHub Actions"**.
3. Edit `src/lib/site.ts` and set `SITE_REPO_URL` to your repository URL
   (this enables the footer source-list link and Chapter 6's "contribute
   code" link, which stay hidden until set).
4. Push — the site goes live at `https://USERNAME.github.io/REPOSITORY_NAME/`.

Manual export (for other static hosts):

```bash
NEXT_OUTPUT=export NEXT_PUBLIC_BASE_PATH="" bun run build:export
# output in ./out/ — serve it with any static file server
```

## Updating and extending

- **Add a language.** Copy `src/i18n/en.ts`, translate every string, register
  the locale in `src/i18n/index.tsx`, and add a button in
  `src/components/Header.tsx`. `bun run validate:i18n` will keep you honest.
- **Add a chapter.** Follow the existing pattern: content in both i18n
  dictionaries, a section component, data (if any) through the Python
  pipeline, and a row in `docs/sources.md` for every new statistic.
- **Data rules.** Every number needs: a primary source, a statistical
  reference year, a license check, and a limitations note. See
  [`docs/methodology.md`](docs/methodology.md).

## Testing and validation

- `bun run lint` — code quality (0 errors expected)
- `bun run validate:i18n` — 216 structural paths must match across languages
- `python3 scripts/validate_data.py` — 19,718 data checks, 0 failures expected
- `python3 scripts/check_tsc_baseline.py tsc-current.txt` — TypeScript
  diagnostics must not regress beyond the documented baseline (pre-existing
  baseline diagnostics are listed in `tests/typescript-baseline.txt`; the
  production build does not type-gate, so PR CI reports tsc status
  explicitly)
- Manual QA checklist: both languages × desktop/mobile, keyboard navigation,
  map interactions (hover/tap/click/search), chart controls, reduced-motion
  mode, offline data-file failure states.

## License and attribution

- **Code:** MIT — see [`LICENSE`](LICENSE).
- **Data:** attributed per dataset and licensed by their publishers (FAO
  CC BY 4.0, World Bank CC BY 4.0, OWID CC BY, GRFC/FSIN with attribution,
  UNEP, Natural Earth public domain). See
  [`docs/sources.md`](docs/sources.md) for the complete list.
- **Libraries:** Next.js (MIT), ECharts (Apache-2.0), React (MIT),
  Tailwind CSS (MIT), shadcn/ui primitives (MIT).

This is an independent, non-commercial educational project. It is not
affiliated with, endorsed by, or an official publication of the United
Nations, FAO, WFP, IPC, UNEP or any other organization referenced. All names
and data belong to their respective owners and are cited with attribution.

## Roadmap

Ideas for Chapter 02 / v2 — famine case files (Somalia 2011, Sudan, Gaza),
nutrition beyond calories (stunting, wasting, hidden hunger), food systems
and loss along the chain, country deep-dives, additional locales (es, fr,
ar, hi), and an embedded citation widget on every statistic.
