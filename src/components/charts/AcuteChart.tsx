"use client";

// AcuteChart — Chapter 5. People in IPC/CH Phase 3+ food crisis, 2016–2025,
// with the assessed-country count printed under each bar (coverage honesty:
// the 2025 figure covers 47 countries, the lowest in a decade).

import { useMemo } from "react";
import { BaseChart, THEME, baseTooltip, type ChartOption } from "./BaseChart";
import { useI18n } from "@/i18n";
import { usePrefersReducedMotion } from "@/lib/useLazyData";
import { formatCountries, formatPeople } from "@/lib/format";

export type AcutePoint = { year: number; millions: number; countries: number };

export function AcuteChart({ series }: { series: AcutePoint[] }) {
  const { t, locale } = useI18n();
  const reduced = usePrefersReducedMotion();

  const option = useMemo<ChartOption>(() => {
    return {
      backgroundColor: "transparent",
      grid: { left: 8, right: 16, top: 30, bottom: 8, containLabel: true },
      tooltip: {
        ...baseTooltip(),
        trigger: "axis",
        axisPointer: { type: "shadow", shadowStyle: { color: "rgba(199,163,108,0.08)" } },
        formatter: (params: unknown) => {
          const p = (
            params as Array<{ data: AcutePoint & { value: number } }>
          )[0];
          if (!p) return "";
          const d = p.data;
          return (
            `<b>${d.year}</b><br/>` +
            `${formatPeople(d.millions, t.common, locale)}<br/>` +
            `<span style="color:${THEME.creamDim}">${formatCountries(d.countries, t.common)}</span>`
          );
        },
      },
      xAxis: {
        type: "category",
        data: series.map((d) => d.year),
        axisLabel: {
          formatter: (year: number, idx: number) =>
            `${year}\n${formatCountries(series[idx].countries, t.common)}`,
          color: THEME.creamDim,
          fontFamily: THEME.fontUi,
          fontSize: 10.5,
          lineHeight: 15,
          interval: 0,
        },
        axisLine: { lineStyle: { color: THEME.line } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 320,
        axisLabel: {
          color: THEME.creamDim,
          fontFamily: THEME.fontUi,
          fontSize: 11,
        },
        splitLine: { lineStyle: { color: "rgba(242,241,232,0.06)" } },
      },
      series: [
        {
          type: "bar",
          name: t.ch5.acuteChartTitle,
          data: series.map((d) => ({
            value: d.millions,
            year: d.year,
            millions: d.millions,
            countries: d.countries,
          })),
          barWidth: "62%",
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: THEME.gold },
                { offset: 1, color: "#8a6a3c" },
              ],
            },
          },
          label: {
            show: true,
            position: "top",
            color: THEME.creamDim,
            fontFamily: THEME.fontUi,
            fontSize: 10.5,
            formatter: (p: { value: number }) => p.value.toFixed(0),
          },
          emphasis: {
            itemStyle: { color: THEME.goldBright },
          },
        },
      ],
    };
  }, [series, t, locale]);

  return (
    <BaseChart
      option={option}
      ariaLabel={`${t.ch5.acuteChartTitle}. ${t.common.chartAriaFallback}`}
      animation={!reduced}
      style={{ height: "clamp(320px, 44vh, 420px)", width: "100%" }}
    />
  );
}
