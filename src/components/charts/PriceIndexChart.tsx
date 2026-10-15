"use client";

// PriceIndexChart — Chapter 4 (economic driver). FAO Food Price Index,
// annual averages 2000–2025 (2014–2016 = 100), with the 2022 record marked
// and the index baseline drawn as a dashed reference line.

import { useMemo } from "react";
import { BaseChart, THEME, baseTooltip, type ChartOption } from "./BaseChart";
import { useI18n } from "@/i18n";
import { usePrefersReducedMotion } from "@/lib/useLazyData";

export type FpiPoint = { year: number; value: number };

export function PriceIndexChart({ series }: { series: FpiPoint[] }) {
  const { t } = useI18n();
  const reduced = usePrefersReducedMotion();

  const option = useMemo<ChartOption>(() => {
    // Safe on an empty series: `reduce` without an initial value would throw
    // on `[]`, so peak becomes null and the markPoint is simply omitted.
    const peak =
      series.length > 0
        ? series.reduce((a, b) => (b.value > a.value ? b : a))
        : null;
    return {
      backgroundColor: "transparent",
      grid: { left: 8, right: 18, top: 26, bottom: 8, containLabel: true },
      tooltip: {
        ...baseTooltip(),
        trigger: "axis",
        axisPointer: { type: "line", lineStyle: { color: "rgba(199,163,108,0.4)" } },
        formatter: (params: unknown) => {
          const p = (params as Array<{ value: [string, number] }>)[0];
          if (!p) return "";
          return `<b>${p.value[0]}</b><br/>${p.value[1].toFixed(1)}`;
        },
      },
      // Category axis: values must be strings. On a category axis ECharts 6
      // resolves each [x, y] pair's x through OrdinalMeta.getOrdinal — a
      // Map keyed by the raw value — so a numeric year (2022) never matches
      // a string category ("2022") and is instead treated as an ordinal
      // INDEX, placing the point far outside the grid. Hence the strings.
      xAxis: {
        type: "category",
        data: series.map((d) => String(d.year)),
        boundaryGap: false,
        axisLabel: {
          color: THEME.creamDim,
          fontFamily: THEME.fontUi,
          fontSize: 11,
          formatter: (v: string) => {
            const year = Number(v);
            return Number.isFinite(year) && year % 5 === 0 ? v : "";
          },
        },
        axisLine: { lineStyle: { color: THEME.line } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        min: 40,
        max: 160,
        axisLabel: {
          color: THEME.creamDim,
          fontFamily: THEME.fontUi,
          fontSize: 11,
        },
        splitLine: { lineStyle: { color: "rgba(242,241,232,0.06)" } },
      },
      series: [
        {
          type: "line",
          data: series.map((d) => [String(d.year), d.value]),
          symbol: "circle",
          symbolSize: 4,
          showSymbol: false,
          lineStyle: { color: THEME.gold, width: 2.6 },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(199,163,108,0.28)" },
                { offset: 1, color: "rgba(199,163,108,0.02)" },
              ],
            },
          },
          markLine: {
            silent: true,
            symbol: "none",
            lineStyle: { color: "rgba(180,201,190,0.35)", type: "dashed" },
            label: { show: false },
            data: [{ yAxis: 100 }],
          },
          ...(peak
            ? {
                markPoint: {
                  symbol: "circle",
                  symbolSize: 9,
                  // THEME.mapScale[5] is the site's highest-intensity rust
                  // (#c05b3b) — the intended accent. (The original
                  // `THEME.map6` referenced a property that does not exist,
                  // silently falling back to ECharts' default blue.)
                  itemStyle: { color: THEME.mapScale[5] },
                  label: {
                    show: true,
                    position: "top",
                    color: THEME.goldBright,
                    fontFamily: THEME.fontUi,
                    fontSize: 11,
                    formatter: () => `${peak.year}: ${peak.value.toFixed(1)}`,
                  },
                  data: [{ coord: [String(peak.year), peak.value] }],
                },
              }
            : {}),
          z: 5,
        },
      ],
    };
  }, [series]);

  return (
    <BaseChart
      option={option}
      ariaLabel={`${t.ch4.causes[3].chartTitle}. ${t.common.chartAriaFallback}`}
      animation={!reduced}
      style={{ height: "clamp(280px, 40vh, 360px)", width: "100%" }}
    />
  );
}
