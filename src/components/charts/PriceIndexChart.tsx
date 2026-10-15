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
    const peak = series.reduce((a, b) => (b.value > a.value ? b : a));
    return {
      backgroundColor: "transparent",
      grid: { left: 8, right: 18, top: 26, bottom: 8, containLabel: true },
      tooltip: {
        ...baseTooltip(),
        trigger: "axis",
        axisPointer: { type: "line", lineStyle: { color: "rgba(199,163,108,0.4)" } },
        formatter: (params: unknown) => {
          const p = (params as Array<{ value: [number, number] }>)[0];
          if (!p) return "";
          return `<b>${p.value[0]}</b><br/>${p.value[1].toFixed(1)}`;
        },
      },
      xAxis: {
        type: "category",
        data: series.map((d) => d.year),
        boundaryGap: false,
        axisLabel: {
          color: THEME.creamDim,
          fontFamily: THEME.fontUi,
          fontSize: 11,
          formatter: (v: number) => (v % 5 === 0 ? String(v) : ""),
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
          data: series.map((d) => [d.year, d.value]),
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
          markPoint: {
            symbol: "circle",
            symbolSize: 9,
            itemStyle: { color: THEME.map6 },
            label: {
              show: true,
              position: "top",
              color: THEME.goldBright,
              fontFamily: THEME.fontUi,
              fontSize: 11,
              formatter: () => `${peak.year}: ${peak.value.toFixed(1)}`,
            },
            data: [{ coord: [peak.year, peak.value] }],
          },
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
