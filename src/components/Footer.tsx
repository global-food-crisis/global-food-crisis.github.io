"use client";

// Footer — independence disclaimer, source list, license and data vintage.

import { useI18n } from "@/i18n";
import { SITE_REPO_URL } from "@/lib/site";

export function Footer() {
  const { t } = useI18n();
  // The link stays hidden until the repository URL is configured (site.ts).
  const sourcesUrl =
    t.footer.sourcesUrl === "https://github.com/"
      ? SITE_REPO_URL || null
      : t.footer.sourcesUrl;
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
      </div>
    </footer>
  );
}
