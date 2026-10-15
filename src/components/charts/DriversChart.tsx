"use client";

// DriversChart — Chapter 4. Primary driver of acute food insecurity, 2025
// (one attributed driver per country; populations nearly disjoint).
// Labels reuse the cause titles from the i18n dictionary.

import { useMemo } from "react";
import { BaseChart, THEME, baseTooltip, type ChartOption } from "./BaseChart";
import { useI18n } from "@/i18n";
import { usePrefersReducedMotion } from "@/lib/useLazyData";
import { formatCountries, formatPeople } from "@/lib/format";

export type DriverStat = { driver: string; millions: number; countries: number };

const COLORS: Record<string, string> = {
  conflict: "#c05b3b",
  climate: "#8fa074",
  economic: "#c7a36c",
};

// Map raw driver names (from the data file) to cause ids in the dictionary.
const DRIVER_TO_CAUSE: Record<string, string> = {
  "Conflict and insecurity": "conflict",
  "Weather extremes": "climate",
  "Economic shocks": "economic",
};

export function DriversChart({ drivers }: { drivers: DriverStat[] }) {
  const { t, locale } = useI18n();
  const reduced = usePrefersReducedMotion();

  const labels = useMemo(() => {
    const byId = new Map(t.ch4.causes.map((c) => [c.id, c.title]));
    return drivers.map(
      (d) => byId.get(DRIVER_TO_CAUSE[d.driver] ?? "") ?? d.driver,
    );
  }, [drivers, t]);

  const option = useMemo<ChartOption>(() => {
    return {
      backgroundColor: "transparent",
      grid: { left: 8, right: 90, top: 8, bottom: 8, containLabel: true },
      tooltip: {
        ...baseTooltip(),
        trigger: "axis",
        axisPointer: { type: "shadow", shadowStyle: { color: "rgba(199,163,108,0.08)" } },
        formatter: (params: unknown) => {
          const p = (params as Array<{ dataIndex: number }>)[0];
          if (p == null) return "";
          const d = drivers[p.dataIndex];
          return (
            `<b>${labels[p.dataIndex]}</b><br/>` +
            `${formatPeople(d.millions, t.common, locale)}<br/>` +
            `<span style="color:${THEME.creamDim}">${formatCountries(d.countries, t.common)}</span>`
          );
        },
      },
      xAxis: {
        type: "value",
        min: 0,
        max: 165,
        axisLabel: {
          formatter: (v: number) => `${v}`,
          color: THEME.creamDim,
          fontFamily: THEME.fontUi,
          fontSize: 11,
        },
        splitLine: { lineStyle: { color: "rgba(242,241,232,0.06)" } },
      },
      yAxis: {
        type: "category",
        inverse: true,
        data: labels,
        axisLabel: {
          color: THEME.cream,
          fontFamily: THEME.fontUi,
          fontSize: 12,
          width: 160,
          overflow: "truncate",
        },
        axisLine: { lineStyle: { color: THEME.line } },
        axisTick: { show: false },
      },
      series: [
        {
          type: "bar",
          data: drivers.map((d) => ({
            value: d.millions,
            itemStyle: {
              borderRadius: [0, 4, 4, 0],
              color:
                COLORS[DRIVER_TO_CAUSE[d.driver] ?? ""] ?? THEME.gold,
            },
          })),
          barWidth: "52%",
          label: {
            show: true,
            position: "right",
            distance: 8,
            color: THEME.creamDim,
            fontFamily: THEME.fontUi,
            fontSize: 11,
            formatter: (p: { dataIndex: number }) => {
              const d = drivers[p.dataIndex];
              return `${formatPeople(d.millions, t.common, locale)}\n${formatCountries(d.countries, t.common)}`;
            },
            lineHeight: 16,
          },
        },
      ],
    };
  }, [drivers, labels, t, locale]);

  return (
    <BaseChart
      option={option}
      ariaLabel={`${t.ch4.driversChartTitle}. ${t.common.chartAriaFallback}`}
      animation={!reduced}
      style={{ height: "240px", width: "100%" }}
    />
  );
}
