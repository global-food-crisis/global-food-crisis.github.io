"use client";

// TrendChart — Chapter 5. Global undernourishment over time with two views:
// share of population (%) vs number of people (millions), optional regional
// comparison (share view), and the newest SOFI 2026 vintage marked as an
// isolated point (never spliced into the OWID-republished series).
//
// Design notes:
// - Every series carries a stable `id` and an explicit top-level `color`
//   resolved from the fixed region→color map in src/lib/trendChartLogic.ts.
//   Curves, data points, legend icons, chip dots and tooltip markers all
//   share that one map, so colors can never depend on the selection set,
//   its order, or the language.
// - The percent view's y-axis ceiling adapts to the visible series (world +
//   selected regions) so high-prevalence regions such as Africa (15.5–22.1%)
//   are never clipped; it is always a multiple of 5 to keep clean ticks.
// - A region whose every point is flagged `below` (FAO "<2.5%" reporting
//   floor — Europe in this series) is drawn dashed and labelled "<2.5%" in
//   tooltips: the flat line marks the measurement floor, not an exact value.

import { useMemo, useState } from "react";
import { BaseChart, THEME, baseTooltip, type ChartOption } from "./BaseChart";
import { useI18n } from "@/i18n";
import { usePrefersReducedMotion } from "@/lib/useLazyData";
import { formatPeople } from "@/lib/format";
import {
  REGION_KEYS,
  REGION_COLORS,
  WORLD_COLOR,
  nicePercentMax,
  isThresholdFloorSeries,
  seriesColor,
  type RegionKey,
  type TrendData,
  type TrendPoint,
} from "@/lib/trendChartLogic";

export type { TrendData, TrendPoint };

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
        id: "world",
        name: t.ch5.regionWorld,
        color: WORLD_COLOR,
        data: (isPercent ? data.worldPercent : data.worldNumber).map((p) => [
          p.year,
          p.value,
        ]),
        symbol: "circle",
        symbolSize: 5,
        showSymbol: false,
        lineStyle: { color: WORLD_COLOR, width: 3 },
        itemStyle: { color: WORLD_COLOR },
        emphasis: { focus: "series" },
        z: 10,
      },
    ];

    if (isPercent) {
      for (const key of REGION_KEYS) {
        if (!regionsOn.has(key)) continue;
        const pts = data.regions[key];
        const floorSeries = isThresholdFloorSeries(pts);
        series.push({
          type: "line",
          id: key,
          name: regionLabels[key],
          color: REGION_COLORS[key],
          data: pts.map((p) => [p.year, p.value]),
          symbol: "none",
          lineStyle: {
            color: REGION_COLORS[key],
            width: 1.8,
            opacity: 0.9,
            ...(floorSeries ? { type: "dashed" as const } : {}),
          },
          itemStyle: { color: REGION_COLORS[key] },
          emphasis: { focus: "series" },
        });
      }
    }

    // The newest SOFI 2026 estimate — a separate vintage, drawn as an
    // isolated point, deliberately not connected to the series above.
    series.push({
      type: "scatter",
      id: "sofi",
      name: "SOFI 2026",
      color: WORLD_COLOR,
      data: sofiPoint.map((p) => [p.year, p.value]),
      symbolSize: 11,
      itemStyle: {
        color: WORLD_COLOR,
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

    // Percent-view ceiling: must clear every visible series (world +
    // selected regions); a multiple of 5 keeps the 5-point ticks clean.
    const visibleValues = isPercent
      ? [
          ...data.worldPercent.map((p) => p.value),
          ...REGION_KEYS.filter((k) => regionsOn.has(k)).flatMap((k) =>
            data.regions[k].map((p) => p.value),
          ),
        ]
      : [];
    const yMax = isPercent ? nicePercentMax(visibleValues) : 900;

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
        // purely informational — selection state lives in the chips above
        // the chart, so legend clicks must not desync from them
        selectedMode: false,
        textStyle: { color: THEME.creamDim, fontFamily: THEME.fontUi, fontSize: 11 },
        inactiveColor: "#4a5a52",
      },
      tooltip: {
        ...baseTooltip(),
        trigger: "axis",
        axisPointer: { type: "line", lineStyle: { color: "rgba(199,163,108,0.4)" } },
        formatter: (params: unknown) => {
          const list = params as Array<{
            seriesId?: string;
            seriesName: string;
            value: [number, number];
            marker: string;
          }>;
          if (!Array.isArray(list) || list.length === 0) return "";
          const year = list[0].value[0];
          const rows = list
            .filter((s) => s.value != null && !Number.isNaN(s.value[1]))
            .map((s) => {
              // resolve the source point (by stable series id) to read the
              // FAO reporting-floor flag carried in the data file
              const sid = s.seriesId ?? "";
              const src: TrendPoint[] | undefined =
                sid === "world"
                  ? isPercent
                    ? data.worldPercent
                    : data.worldNumber
                  : sid && (REGION_KEYS as string[]).includes(sid)
                    ? data.regions[sid as RegionKey]
                    : undefined;
              const pt = src?.find((p) => p.year === year);
              const floored = pt?.below === true;
              const v = isPercent
                ? floored
                  ? t.ch5.floorLabel
                  : `${s.value[1].toFixed(1)}%`
                : formatPeople(s.value[1], t.common, locale);
              const rowColor =
                sid === "world" || sid === "sofi"
                  ? WORLD_COLOR
                  : sid && (REGION_KEYS as string[]).includes(sid)
                    ? REGION_COLORS[sid as RegionKey]
                    : THEME.goldBright;
              return `${s.marker} ${s.seriesName}: <b style="color:${rowColor}">${v}</b>`;
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
        max: yMax,
        ...(isPercent ? { interval: 5 } : {}),
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
              <span
                className="chip__dot"
                style={{ background: seriesColor(key) }}
                aria-hidden="true"
              />
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
