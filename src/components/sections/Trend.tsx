"use client";

// Trend — Chapter 5. Chronic-hunger trend with percent / number views and
// regional comparison, the acute-crisis series since 2016 (with coverage
// labels), historical context, a CSV download and an accessible table.

import { useMemo } from "react";
import { useI18n } from "@/i18n";
import { useLazyJson } from "@/lib/useLazyData";
import { assetUrl } from "@/lib/basePath";
import { Reveal } from "../Reveal";
import { SourceNote } from "../SourceNote";
import { TrendChart, type TrendData } from "../charts/TrendChart";
import { AcuteChart, type AcutePoint } from "../charts/AcuteChart";

export function Trend() {
  const { t } = useI18n();
  const trend = useLazyJson<TrendData>("/data/trend.json");
  const acute = useLazyJson<{ series: AcutePoint[] }>(
    "/data/acute-food-insecurity.json",
  );

  const tableRows = useMemo(() => {
    if (trend.status !== "ready" || !trend.data) return [];
    const d = trend.data;
    const numbers = new Map(d.worldNumber.map((p) => [p.year, p.value]));
    const rows = d.worldPercent.map((p) => ({
      year: p.year,
      pct: p.value,
      num: numbers.get(p.year) ?? null,
    }));
    rows.push({
      year: 2025,
      pct: d.sofi2026.percent[0].value,
      num: d.sofi2026.number[0].value,
      sofi: true,
    });
    return rows;
  }, [trend.status, trend.data]);

  const statusBox = (
    label: string,
    retry: () => void,
    ref?: React.RefObject<HTMLDivElement | null>,
  ) => (
    <div className="chart-status" ref={ref}>
      <div className="spinner" aria-hidden="true" />
      <p style={{ margin: 0 }}>{label}</p>
    </div>
  );

  return (
    <section id="ch5" className="chapter chapter--tinted" aria-label={t.nav.chapterLabels[4]}>
      <div className="shell">
        <Reveal>
          <p className="kicker">{t.ch5.kicker}</p>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="h-chapter">{t.ch5.title}</h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="lede" style={{ marginTop: "1.1rem" }}>
            {t.ch5.lede}
          </p>
        </Reveal>

        <Reveal>
          <div className="chart-frame" style={{ marginTop: "2.4rem" }}>
            <div className="chart-frame__head">
              <h3 className="chart-title">{t.ch5.chartTitle}</h3>
            </div>
            {trend.status === "ready" && trend.data ? (
              <TrendChart data={trend.data} />
            ) : trend.status === "error" ? (
              <div className="chart-status">
                <p style={{ margin: 0, color: "var(--cream)", fontWeight: 600 }}>
                  {t.common.errorTitle}
                </p>
                <p style={{ margin: 0, maxWidth: "44ch" }}>{t.common.errorBody}</p>
                <button type="button" className="link-btn" onClick={trend.retry}>
                  {t.common.retry}
                </button>
              </div>
            ) : (
              statusBox(t.common.loadingChart, trend.retry, trend.ref)
            )}
            <p className="chart-note">
              {t.ch5.vintageNote} {t.ch5.floorNote} {t.ch5.numberSourceNote}
            </p>
            <SourceNote
              name="FAO · Our World in Data"
              url="https://ourworldindata.org/grapher/prevalence-of-undernourishment"
              year={2024}
            />
          </div>
        </Reveal>

        <div className="two-col" style={{ marginTop: "2.6rem" }}>
          <Reveal>
            <div className="card">
              <h3 className="chart-title">{t.ch5.percentVsNumberTitle}</h3>
              <p
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "0.88rem",
                  lineHeight: 1.7,
                  color: "var(--cream-dim)",
                  margin: "0.6rem 0 0",
                }}
              >
                {t.ch5.percentVsNumberBody}
              </p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="card">
              <h3 className="chart-title">{t.ch5.contextTitle}</h3>
              <ul className="context-list">
                {t.ch5.context.map((c) => {
                  const idx = c.indexOf(":");
                  const head = idx > 0 ? c.slice(0, idx + 1) : "";
                  const rest = idx > 0 ? c.slice(idx + 1) : c;
                  return (
                    <li key={c.slice(0, 24)}>
                      <strong>{head}</strong>
                      {rest}
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div style={{ marginTop: "2.6rem" }}>
            <h3 className="h-sub">{t.ch5.acuteTitle}</h3>
            <div className="chart-frame" style={{ marginTop: "0.8rem" }}>
              <div className="chart-frame__head">
                <h3 className="chart-title">{t.ch5.acuteChartTitle}</h3>
              </div>
              {acute.status === "ready" && acute.data ? (
                <AcuteChart series={acute.data.series} />
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
                statusBox(t.common.loadingChart, acute.retry, acute.ref)
              )}
              <p className="chart-note">{t.ch5.acuteNote}</p>
              <SourceNote
                name={t.ch2.indicators[2].sourceName}
                url={t.ch2.indicators[2].sourceUrl}
                year={2025}
              />
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="download-row">
            <a
              className="link-btn"
              href={assetUrl("/data/trend.csv")}
              download="global-food-crisis-trend.csv"
            >
              ⬇ {t.ch5.downloadLabel}
            </a>
            <span className="chart-note" style={{ margin: 0 }}>
              {t.ch5.downloadNote}
            </span>
          </div>
        </Reveal>

        <Reveal>
          <div style={{ marginTop: "2.2rem" }}>
            <h3 className="h-sub" style={{ marginBottom: "0.6rem" }}>
              {t.ch5.tableTitle}
            </h3>
            <div className="data-table-wrap">
              <table className="data-table">
                <caption>
                  {t.ch5.chartTitle} — * {t.ch5.sofiMarker} · {t.ch5.sofiMarkerNumber}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">{t.ch5.tableYear}</th>
                    <th scope="col">{t.ch5.tablePercent}</th>
                    <th scope="col">{t.ch5.tableNumber}</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((r) => (
                    <tr key={r.year}>
                      <td>
                        {r.year}
                        {r.sofi ? " *" : ""}
                      </td>
                      <td>{r.pct.toFixed(1)}</td>
                      <td>{r.num == null ? "—" : r.num.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
