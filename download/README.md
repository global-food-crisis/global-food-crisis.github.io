# Deliverables — Global Food Crisis site updates

## 2026-10-16 — Link & copy fixes (this round)

**ZIP:** `gfc-links-and-share.zip` — 7 files, project-relative paths. Replace these files in your repo (no files to add or delete):

- `src/i18n/en.ts` — Ch2 source URL, Ch6 link fixes, share-section rewrite (EN)
- `src/i18n/zh-TW.ts` — same changes, Traditional Chinese
- `src/components/sections/Scale.tsx` — passes the new source URL to the note
- `src/components/sections/Action.tsx` — removes the dead GitHub placeholder logic
- `src/lib/site.ts` — comment update only (footer source-link behavior unchanged)
- `docs/sources.md` — link-verification log (broken → fixed mapping, Ch2 evidence note)
- `.gitignore` — ignores local QA screenshot folder (optional, harmless)

What changed on the site:
1. **Ch2** — "GRFC 2026" under the child-malnutrition note is now a clickable link to the official GNAFC report page (data re-verified against the 2026-04-24 joint press release).
2. **Ch6 links** — foodbanking.org/get-involved (404) → `/global-reach/` member directory; unep.org/act-now (404, miscategorized) → UNEP "Seven ways to cut your food waste", moved to waste; fao.org/food-loss-and-food-waste-flw (404) → FAO Policy Support FLW page; www.sdgs.un.org (DNS error) → sdgs.un.org/goals/goal2.
3. **Ch6 "I want to contribute code" → "I want to share this site"** — encourages sharing/citing with attribution; license-aware (MIT code, publisher-owned data); no contributor recruitment or new processes.

## Earlier rounds

- `fpi-fix-PriceIndexChart.zip` / `PriceIndexChart.tsx` — blank FAO Food Price Index chart fix (stringify years on category axis + marker color).
- `gfc-ch5-fixes.zip` — Chapter 5 trend chart fixes (adaptive y-axis, Europe <2.5% floor, fixed region colors) + Chapter 4 FPI explainer.

Upload the changed files, commit to `main`, and let GitHub Actions redeploy (same static-export pipeline).
