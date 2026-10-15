"use client";

// TrendChart — Chapter 5. Global undernourishment over time with two views:
// share of population (%) vs number of people (millions), optional regional
// comparison (share view only), and the newest SOFI 2026 vintage marked as an
// isolated point (never spliced into the OWID-republished series).

import { useMemo, useState } from "react";
import { BaseChart, THEME, baseTooltip, type ChartOption } from "./BaseChart";
import { useI18n } from "@/i18n";
import { usePrefersReducedMotion } from "@/lib/useLazyData";
import { formatPeople } from "@/lib/format";

export type Point = { year: number; value: number };
export type TrendData = {
  worldPercent: Point[];
  worldNumber: Point[];
  sofi2026: { percent: Point[]; number: Point[] };
  regions: Record<"africa" | "asia" | "americas" | "europe" | "oceania", Point[]>;
};

const REGION_KEYS = ["africa", "asia", "americas", "europe", "oceania"] as const;
type RegionKey = (typeof REGION_KEYS)[number];

const REGION_COLORS: Record<RegionKey, string> = {
  africa: "#c05b3b",
  asia: "#8fa074",
  americas: "#ce8b54",
  europe: "#b4c9be",
  oceania: "#6e7f74",
};

export function TrendChart({ data }: { data: TrendData }) {
  const { t, locale } = useI18n();
  const reduced = usePrefersReducedMotion();
  const [metric, setMetric] = useState<"percent" | "number">("percent");
  const [regionsOn, setRegionsOn] = useState<Set<RegionKey>>(new Set());

  const regionLabels: Record<RegionKey, string> = useMemo(
    () => ({
      africa: t.ch5.regionAfrica,
      asia: t.ch5.regionAsia,
      americas: t.ch5.regionAmericas,
      europe: t.ch5.regionEurope,
      oceania: t.ch5.regionOceania,
    }),
    [t],
  );

  const option = useMemo<ChartOption>(() => {
    const isPercent = metric === "percent";
    const sofiPoint = isPercent ? data.sofi2026.percent : data.sofi2026.number;

    const series: ChartOption["series"] = [
      {
        type: "line",
        name: t.ch5.regionWorld,
        data: (isPercent ? data.worldPercent : data.worldNumber).map((p) => [
          p.year,
          p.value,
        ]),
        symbol: "circle",
        symbolSize: 5,
        showSymbol: false,
        lineStyle: { color: THEME.goldBright, width: 3 },
        itemStyle: { color: THEME.goldBright },
        emphasis: { focus: "series" },
        z: 10,
      },
    ];

    if (isPercent) {
      for (const key of REGION_KEYS) {
        if (!regionsOn.has(key)) continue;
        series.push({
          type: "line",
          name: regionLabels[key],
          data: data.regions[key].map((p) => [p.year, p.value]),
          symbol: "none",
          lineStyle: { color: REGION_COLORS[key], width: 1.8, opacity: 0.9 },
          emphasis: { focus: "series" },
        });
      }
    }

    // The newest SOFI 2026 estimate — a separate vintage, drawn as an
    // isolated point, deliberately not connected to the series above.
    series.push({
      type: "scatter",
      name: "SOFI 2026",
      data: sofiPoint.map((p) => [p.year, p.value]),
      symbolSize: 11,
      itemStyle: {
        color: THEME.goldBright,
        borderColor: THEME.ink,
        borderWidth: 2,
      },
      label: {
        show: true,
        formatter: isPercent ? t.ch5.sofiMarker : t.ch5.sofiMarkerNumber,
        position: "top",
        align: "right",
        distance: 10,
        color: THEME.cream,
        fontFamily: THEME.fontUi,
        fontSize: 11,
      },
      z: 12,
    });

    return {
      backgroundColor: "transparent",
      grid: { left: 8, right: 16, top: 34, bottom: 56, containLabel: true },
      legend: {
        show: isPercent && regionsOn.size > 0,
        top: 0,
        left: 0,
        icon: "roundRect",
        itemWidth: 14,
        itemHeight: 3,
        textStyle: { color: THEME.creamDim, fontFamily: THEME.fontUi, fontSize: 11 },
        inactiveColor: "#4a5a52",
      },
      tooltip: {
        ...baseTooltip(),
        trigger: "axis",
        axisPointer: { type: "line", lineStyle: { color: "rgba(199,163,108,0.4)" } },
        formatter: (params: unknown) => {
          const list = params as Array<{
            seriesName: string;
            value: [number, number];
            marker: string;
          }>;
          if (!Array.isArray(list) || list.length === 0) return "";
          const year = list[0].value[0];
          const rows = list
            .filter((s) => s.value != null && !Number.isNaN(s.value[1]))
            .map((s) => {
              const v = isPercent
                ? `${s.value[1].toFixed(1)}%`
                : formatPeople(s.value[1], t.common, locale);
              return `${s.marker} ${s.seriesName}: <b style="color:${THEME.goldBright}">${v}</b>`;
            });
          return `<b>${year}</b><br/>${rows.join("<br/>")}`;
        },
      },
      xAxis: {
        type: "value",
        min: 2000,
        max: 2025.6,
        interval: 5,
        axisLabel: {
          formatter: (v: number) => String(v),
          color: THEME.creamDim,
          fontFamily: THEME.fontUi,
          fontSize: 11,
        },
        axisLine: { lineStyle: { color: THEME.line } },
        axisTick: { show: false },
        splitLine: { show: false },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: isPercent ? 14 : 900,
        axisLabel: {
          formatter: (v: number) => (isPercent ? `${v}%` : `${v}`),
          color: THEME.creamDim,
          fontFamily: THEME.fontUi,
          fontSize: 11,
        },
        splitLine: { lineStyle: { color: "rgba(242,241,232,0.06)" } },
      },
      dataZoom: [
        {
          type: "inside",
          filterMode: "none",
          zoomLock: false,
        },
        {
          type: "slider",
          height: 16,
          bottom: 8,
          filterMode: "none",
          borderColor: THEME.line,
          fillerColor: "rgba(199,163,108,0.18)",
          handleStyle: { color: THEME.gold, borderColor: THEME.gold },
          moveHandleStyle: { color: THEME.ink3 },
          textStyle: { color: THEME.creamDim, fontFamily: THEME.fontUi, fontSize: 10 },
          dataBackground: {
            lineStyle: { color: "rgba(180,201,190,0.3)" },
            areaStyle: { color: "rgba(180,201,190,0.08)" },
          },
          brushSelect: false,
        },
      ],
      series,
    };
  }, [data, metric, regionsOn, regionLabels, t, locale]);

  const toggleRegion = (key: RegionKey) => {
    setRegionsOn((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div>
      <div
        className="chart-controls"
        role="group"
        aria-label={t.ch5.chartTitle}
      >
        <button
          type="button"
          className="chip"
          aria-pressed={metric === "percent"}
          onClick={() => setMetric("percent")}
        >
          {t.ch5.viewPercent}
        </button>
        <button
          type="button"
          className="chip"
          aria-pressed={metric === "number"}
          onClick={() => setMetric("number")}
        >
          {t.ch5.viewNumber}
        </button>
        <span className="chart-controls__spacer" aria-hidden="true" />
        {metric === "percent" &&
          REGION_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              className="chip"
              aria-pressed={regionsOn.has(key)}
              onClick={() => toggleRegion(key)}
            >
              {regionLabels[key]}
            </button>
          ))}
        {metric === "percent" && (
          <span className="chart-controls__hint">{t.ch5.regionHint}</span>
        )}
      </div>
      <BaseChart
        option={option}
        ariaLabel={`${t.ch5.chartTitle}. ${t.common.chartAriaFallback}`}
        animation={!reduced}
        style={{ height: "clamp(360px, 52vh, 520px)", width: "100%" }}
      />
    </div>
  );
}
