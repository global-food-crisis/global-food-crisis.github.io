"use client";

// AcuteChart — Chapter 5. People in IPC/CH Phase 3+ food crisis, 2016–2025.
// Coverage honesty: the assessed-country count ("48 countries"...) is printed
// under each bar wherever the canvas is wide enough to fit one label per
// year without overlap; on narrow (phone) canvases the labels are dropped
// and the count moves into the tap/hover tooltip together with the year and
// the people figure (units included). The 2025 figure covers 47 countries,
// the lowest in a decade — the note under the chart keeps that caveat.

import { useMemo } from "react";
import { BaseChart, THEME, baseTooltip, type ChartOption } from "./BaseChart";
import { useI18n } from "@/i18n";
import { usePrefersReducedMotion } from "@/lib/useLazyData";
import { useElementWidth } from "@/lib/useElementWidth";
import { formatCountries, formatPeople } from "@/lib/format";

export type AcutePoint = { year: number; millions: number; countries: number };

// Canvas width at which the two-line year + "N countries" labels stop
// fitting under each of the 10 bars. Measured: "48 countries" renders at
// 65px in 10.5px Inter; 700px canvas gives 65.6px per category cell
// (canvas − 44px grid insets, ÷ 10), so neighbours never collide — and
// below it the coverage figures stay available via the tooltip.
const COVERAGE_LABEL_MIN_WIDTH = 700;

export function AcuteChart({ series }: { series: AcutePoint[] }) {
  const { t, locale } = useI18n();
  const reduced = usePrefersReducedMotion();
  const [wrapRef, width] = useElementWidth();
  const showCoverageLabels = width >= COVERAGE_LABEL_MIN_WIDTH;

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
          // Two-line labels (year + coverage) only when every category cell
          // is wide enough; years alone otherwise, with hideOverlap letting
          // ECharts thin them out further on very narrow canvases so the
          // year row itself can never collide.
          formatter: (year: number, idx: number) =>
            showCoverageLabels
              ? `${year}\n${formatCountries(series[idx].countries, t.common)}`
              : `${year}`,
          color: THEME.creamDim,
          fontFamily: THEME.fontUi,
          fontSize: 10.5,
          lineHeight: 15,
          interval: 0,
          hideOverlap: true,
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
  }, [series, t, locale, showCoverageLabels]);

  return (
    <div ref={wrapRef}>
      <BaseChart
        option={option}
        ariaLabel={`${t.ch5.acuteChartTitle}. ${t.common.chartAriaFallback}`}
        animation={!reduced}
        style={{ height: "clamp(320px, 44vh, 420px)", width: "100%" }}
      />
    </div>
  );
}
