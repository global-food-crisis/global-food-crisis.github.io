"use client";

// Footer — independence disclaimer, source list, license, data vintage, the
// "Further reading" cross-link to the separate Remember to Prevent project
// (kept clearly apart from the primary data sources), and the bottom-of-page
// "Back to top" control in normal document flow.

import { useI18n } from "@/i18n";
import { SITE_REPO_URL } from "@/lib/site";

export function Footer() {
  const { t } = useI18n();
  // The link stays hidden until the repository URL is configured (site.ts).
  const sourcesUrl =
    t.footer.sourcesUrl === "https://github.com/"
      ? SITE_REPO_URL || null
      : t.footer.sourcesUrl;

  // "Back to top" — an in-page scroll only (the href="#top" fallback still
  // works with JavaScript disabled). Focus moves to the hero headline so the
  // keyboard / screen-reader reading position restarts at the top of the
  // story. In-page scrolling also preserves the current language and chart
  // selections — no navigation, no state reset.
  const backToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const heading = document.getElementById("hero-title");
    heading?.focus({ preventScroll: true });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <footer className="footer">
      <div className="shell">
        <p className="kicker">{t.footer.title}</p>
        <p className="prose-editorial dim" style={{ color: "var(--cream-dim)", maxWidth: "70ch", fontSize: "0.92rem", lineHeight: 1.7, marginTop: "1.2rem" }}>
          {t.footer.independence}
        </p>
        <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", marginTop: "2rem" }}>
          <div>
            <p className="chart-title">{t.footer.sourcesTitle}</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {t.footer.sources.map((s) => (
                <li key={s} style={{ fontFamily: "var(--font-ui)", fontSize: "0.8rem", color: "var(--cream-dim)", paddingBlock: "0.3rem", borderBottom: "1px solid rgba(242,241,232,0.05)" }}>
                  {s}
                </li>
              ))}
            </ul>
            {sourcesUrl && (
              <p style={{ marginTop: "0.9rem" }}>
                <a className="link-btn" href={sourcesUrl} target="_blank" rel="noopener noreferrer">
                  {t.footer.sourcesLink} ↗
                </a>
              </p>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", justifyContent: "flex-start" }}>
            <p className="chart-title">License</p>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.8rem", color: "var(--cream-dim)", margin: 0 }}>{t.footer.licenseNote}</p>
            <p className="chart-title" style={{ marginTop: "0.8rem" }}>Data</p>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.8rem", color: "var(--cream-dim)", margin: 0 }}>
              {t.common.retrievedLabel}: {t.common.retrievedDate} — {t.footer.retrievedNote}
            </p>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.8rem", color: "var(--cream-dim)", margin: 0 }}>{t.footer.builtNote}</p>
          </div>
        </div>

        {/* Further reading — a separate cross-link section, deliberately kept
            apart from the primary data sources above. The linked project is an
            independent educational project, not a source for this site's
            statistics. */}
        <section className="footer-reading" aria-label={t.footer.furtherTitle}>
          <p className="chart-title">{t.footer.furtherTitle}</p>
          <p className="footer-reading__text">
            {t.footer.furtherText}{" "}
            <a
              className="footer-reading__link"
              href="https://remember-to-prevent.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              remember-to-prevent.com
              <span aria-hidden="true"> ↗</span>
            </a>
          </p>
        </section>

        {/* Back to top — the very last control, in normal document flow (no
            floating overlay), styled like the site's other pill buttons. */}
        <div className="footer-bottom">
          <a href="#top" className="link-btn" onClick={backToTop}>
            <span aria-hidden="true">↑</span> {t.footer.backToTop}
          </a>
        </div>
      </div>
    </footer>
  );
}
