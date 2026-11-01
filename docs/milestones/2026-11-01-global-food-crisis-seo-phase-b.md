# Global Food Crisis — SEO Phase B: Bilingual Indexable Routes

- **Milestone date:** 2026-11-01
- **Project:** Global Food Crisis — Chapter 01: The World Has Food. Why Does Hunger Persist?
- **Production domain:** https://global-food-crisis.com/
- **Repository:** https://github.com/global-food-crisis/global-food-crisis.github.io
- **Implementation PR:** [#3 — feat(seo): add indexable Traditional Chinese route and bilingual metadata](https://github.com/global-food-crisis/global-food-crisis.github.io/pull/3)
- **Feature branch:** `feat/gfc-zh-tw-seo-phase-b-20261101`
- **Feature commit:** `aa33878`
- **Status:** Implemented, merged, deployed and functionally verified; Google indexing of the new Chinese URL is pending.

## 1. Purpose and scope

Make the existing Traditional Chinese content independently discoverable at its own URL without changing the published six-chapter research narrative or disrupting the established English homepage. Preserve GitHub Pages static hosting, existing chart and table interactions, and mobile navigation.

This milestone covers the **SEO Phase B implementation and release**, not a new research chapter or a revision of the underlying datasets.

## 2. Delivered changes

1. **Independent indexable routes**
   - English: `https://global-food-crisis.com/`
   - Traditional Chinese: `https://global-food-crisis.com/zh-TW/`
   - Implemented as separate Next.js App Router route groups with language-specific root layouts.
2. **Shared source content**
   - Moved the existing six-chapter page to `src/components/ResearchPage.tsx` and reused it for both routes.
   - Git recognized the move of the six-chapter page as **R100 (100% unchanged content)** in the feature commit.
3. **Language-specific SEO**
   - Correct server-rendered `<html lang="en">` and `<html lang="zh-TW">`.
   - Localized title, description and Open Graph metadata.
   - Self-referencing canonical URLs, reciprocal `hreflang` annotations for `en` and `zh-TW`, and `x-default` pointing to the English page.
   - Both URLs published through `sitemap.xml`, including language alternates.
4. **URL-authoritative language behavior**
   - Prevented stored language preferences and legacy client-side title updates from overriding route-specific language and metadata.
   - Replaced JavaScript-only language buttons with real HTML links, preserving keyboard and no-JavaScript navigation.
   - Retained GitHub Pages `basePath` support and added current-chapter preservation during language switching via the existing scrollspy.
5. **Limited styling adjustments**
   - Updated language-switch styles for anchor links while retaining the established visual design.

## 3. Verification evidence

| Verification | Result |
| --- | --- |
| i18n parity | **216** structural paths matched; URLs validated |
| Trend-chart logic | **8** tests passed, **0** failures |
| Public research-data validation | **19,718** checks, **0** failures |
| ESLint | Exit code **0** |
| TypeScript (`tsc --noEmit`) | Exit code **0** |
| Production-domain static export | Exit code **0**; `/`, `/zh-TW`, and `/sitemap.xml` generated |
| Exported HTML language and SEO metadata | English and Traditional Chinese `lang`, titles, descriptions, canonicals, hreflang, and six H2 headings checked |
| XML sitemap | Both absolute URLs and `en`, `zh-TW`, `x-default` alternatives checked |
| No-JavaScript language links | Real `<a href>` links checked in both static HTML files |
| Browser regression | User confirmed both languages, chapter switching, scroll position preservation and reload behavior; earlier stale-hash issue resolved |
| GitHub Pages base-path export | Exit code **0** with `/global-food-crisis.github.io`; both pages had correctly prefixed language links and nine static assets per page |
| PR #3 validation | **3 successful checks**: lint/i18n/logic/data; static export; TypeScript versus documented baseline |
| Merge state | No conflicts; PR #3 merged |
| Deployment | GitHub Actions **Validate and Deploy** on `main` succeeded; user confirmed production features work |

**Environment note:** Windows Git Bash converted a leading-slash `NEXT_PUBLIC_BASE_PATH` into an MSYS Windows path during the first test. Retrying with `MSYS_NO_PATHCONV=1` fixed the command; the base-path static export then passed without application code changes.

## 4. Release and safety boundaries

- Used feature branch → Pull Request → CI review → merge; **no direct push to `main`**.
- Implementation PR #3 contained **9 changed files**; the six-chapter research page was moved without changing its content.
- No research-data JSON, source citations, dependencies or lockfiles were intentionally changed as part of Phase B.
- Build output (`out`, `.next`) and dependencies (`node_modules`) remained ignored and were not included in the commit.
- No new backend, database, authentication or server runtime was required.
- The English canonical URL was preserved.

## 5. Google Search Console follow-up (as of 2026-11-01)

- The new Traditional Chinese URL was initially reported as **not indexed**.
- A request to index `https://global-food-crisis.com/zh-TW/` was successfully submitted.
- The **live URL test** reported that Google **can index the page**. This is a technical eligibility check, **not** confirmation of indexing.
- The updated `https://global-food-crisis.com/sitemap.xml` was successfully resubmitted on **2026-11-01**.
- At the time of the screenshots, Search Console still displayed **2026-10-28** as the last sitemap read date and **1 discovered page**, reflecting an as-yet-unupdated report; the published sitemap itself listed **2 URLs**.
- **Pending:** Google recrawl, actual index inclusion, and subsequent search impressions/rankings. No indexing date or search-ranking improvement is guaranteed.

## 6. Completion criteria and outcome

The planned Phase B implementation is complete: both language routes are available through the static site, SEO annotations and sitemap are generated, local tests and PR checks passed, the changes were merged and deployed, and the user verified production behavior.

**External follow-up remains open:** monitor Google Search Console for actual indexing of `/zh-TW/` and for updated sitemap discovery counts. Do not confuse crawl eligibility or an index-request acknowledgement with a confirmed indexed URL.

## 7. References

- [Production English homepage](https://global-food-crisis.com/)
- [Production Traditional Chinese homepage](https://global-food-crisis.com/zh-TW/)
- [Production sitemap](https://global-food-crisis.com/sitemap.xml)
- [Implementation Pull Request #3](https://github.com/global-food-crisis/global-food-crisis.github.io/pull/3)
- Feature commit: `aa33878`
