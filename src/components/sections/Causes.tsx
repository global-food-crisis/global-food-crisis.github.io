"use client";

// Causes — Chapter 4. Four drivers (conflict, poverty, climate, economic
// shocks), each with an accessible explanation, verified evidence, case
// studies, a correlation-is-not-causation caveat and inline citations.
// The drivers chart shows the GRFC 2026 primary-driver attribution.

import { useI18n } from "@/i18n";
import { useLazyJson, usePrefersReducedMotion } from "@/lib/useLazyData";
import { Reveal } from "../Reveal";
import { SourceNote } from "../SourceNote";
import { DriversChart, type DriverStat } from "../charts/DriversChart";
import { PriceIndexChart, type FpiPoint } from "../charts/PriceIndexChart";

type Cause = {
  id: string;
  title: string;
  headline: string;
  body1: string;
  body2: string;
  caseTitle: string;
  caseBody: string;
  caseSource: string;
  case2Title?: string;
  case2Body?: string;
  case2Source?: string;
  chartTitle?: string;
  chartNote?: string;
  caveat: string;
  sources: Array<{ name: string; url: string }>;
};

export function Causes() {
  const { t } = useI18n();
  const reduced = usePrefersReducedMotion();
  const acute = useLazyJson<{ drivers2025: DriverStat[] }>(
    "/data/acute-food-insecurity.json",
  );
  const fpi = useLazyJson<{ series: FpiPoint[] }>("/data/food-price-index.json");

  const causes = t.ch4.causes as unknown as Cause[];

  return (
    <section id="ch4" className="chapter" aria-label={t.nav.chapterLabels[3]}>
      <div className="shell">
        <Reveal>
          <p className="kicker">{t.ch4.kicker}</p>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="h-chapter">{t.ch4.title}</h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="lede" style={{ marginTop: "1.1rem" }}>
            {t.ch4.lede}
          </p>
        </Reveal>

        <Reveal>
          <div className="chart-frame" style={{ marginTop: "2.4rem" }}>
            <div className="chart-frame__head">
              <h3 className="chart-title">{t.ch4.driversChartTitle}</h3>
            </div>
            {acute.status === "ready" && acute.data ? (
              <DriversChart drivers={acute.data.drivers2025} />
            ) : acute.status === "error" ? (
              <div className="chart-status">
                <p style={{ margin: 0, color: "var(--cream)", fontWeight: 600 }}>
                  {t.common.errorTitle}
                </p>
                <p style={{ margin: 0, maxWidth: "44ch" }}>{t.common.errorBody}</p>
                <button type="button" className="link-btn" onClick={acute.retry}>
                  {t.common.retry}
                </button>
              </div>
            ) : (
              <div className="chart-status" ref={acute.ref}>
                <div className="spinner" aria-hidden="true" />
                <p style={{ margin: 0 }}>{t.common.loadingChart}</p>
              </div>
            )}
            <p className="chart-note">{t.ch4.driversChartNote}</p>
            <SourceNote
              name={t.ch2.indicators[2].sourceName}
              url={t.ch2.indicators[2].sourceUrl}
              year={2025}
            />
          </div>
        </Reveal>

        {causes.map((cause, i) => (
          <Reveal key={cause.id} as="article">
            <div className="card driver-card">
              <div>
                <p className="driver-card__num" aria-hidden="true">
                  {`0${i + 1}`}
                </p>
                <h3 className="h-sub" style={{ margin: "0.3rem 0 0.5rem" }}>
                  {cause.title}
                </h3>
                <p className="driver-card__headline">{cause.headline}</p>
              </div>

              <div className="prose-editorial" style={{ maxWidth: "70ch" }}>
                <p>{cause.body1}</p>
                <p className="dim">{cause.body2}</p>
              </div>

              {cause.id === "economic" && (
                <div className="chart-frame">
                  <div className="chart-frame__head">
                    <h3 className="chart-title">{cause.chartTitle}</h3>
                  </div>
                  {fpi.status === "ready" && fpi.data ? (
                    <PriceIndexChart series={fpi.data.series} />
                  ) : fpi.status === "error" ? (
                    <div className="chart-status">
                      <p style={{ margin: 0, color: "var(--cream)", fontWeight: 600 }}>
                        {t.common.errorTitle}
                      </p>
                      <p style={{ margin: 0, maxWidth: "44ch" }}>{t.common.errorBody}</p>
                      <button type="button" className="link-btn" onClick={fpi.retry}>
                        {t.common.retry}
                      </button>
                    </div>
                  ) : (
                    <div className="chart-status" ref={fpi.ref}>
                      <div className="spinner" aria-hidden="true" />
                      <p style={{ margin: 0 }}>{t.common.loadingChart}</p>
                    </div>
                  )}
                  <p className="chart-note">{cause.chartNote}</p>
                </div>
              )}

              <div className="case-grid">
                <div className="case-box">
                  <h4>{cause.caseTitle}</h4>
                  <p>{cause.caseBody}</p>
                  <SourceNote name={cause.caseSource} />
                </div>
                {cause.case2Title && (
                  <div className="case-box">
                    <h4>{cause.case2Title}</h4>
                    <p>{cause.case2Body}</p>
                    {cause.case2Source && (
                      <SourceNote name={cause.case2Source} />
                    )}
                  </div>
                )}
              </div>

              <p className="caveat" style={{ margin: 0 }}>
                <strong>※</strong> {cause.caveat}
              </p>

              <div className="driver-sources">
                {cause.sources.map((s) => (
                  <a
                    key={s.url}
                    className="link-btn"
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.name} ↗
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
