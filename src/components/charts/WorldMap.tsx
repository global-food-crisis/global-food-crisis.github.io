"use client";

// WorldMap — Chapter 3 choropleth of undernourishment prevalence.
// Explicit "no data" and "assessment too old" states, localized tooltips and
// country names (Intl.DisplayNames), selection highlight, and an accessible
// table alternative rendered by the Geography section.

import { useEffect, useMemo } from "react";
import * as echarts from "echarts/core";
import { BaseChart, THEME, baseTooltip, type ChartOption } from "./BaseChart";
import { useI18n } from "@/i18n";
import { usePrefersReducedMotion } from "@/lib/useLazyData";

export type PouRecord = {
  code: string; // ISO alpha-3
  name: string; // English name (matching the GeoJSON)
  year: number;
  value: number; // percent, 2.5 floor for "<2.5%"
  below: boolean;
  stale: boolean; // assessment too old to map
  a2: string; // ISO alpha-2, for Intl.DisplayNames
};

export type WorldGeo = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: { code: string; name: string };
    geometry: unknown;
  }>;
};

type MapItem = {
  name: string;
  code: string;
  value: number | null;
  below?: boolean;
  year?: number;
  stale?: boolean;
  itemStyle?: { areaColor?: string; borderColor?: string; borderWidth?: number };
};

/** Choropleth breaks — kept in sync with the HTML legend (Geography section). */
export const MAP_BREAKS: Array<{ label: string; color: string }> = [
  { label: "<2.5%", color: THEME.mapScale[0] },
  { label: "2.5–5%", color: THEME.mapScale[1] },
  { label: "5–10%", color: THEME.mapScale[2] },
  { label: "10–20%", color: THEME.mapScale[3] },
  { label: "20–35%", color: THEME.mapScale[4] },
  { label: "35%+", color: THEME.mapScale[5] },
];

export const MAP_NONE = THEME.mapNone;

export function WorldMap({
  countries,
  geo,
  selectedCode,
  onSelect,
}: {
  countries: PouRecord[];
  geo: WorldGeo;
  selectedCode: string | null;
  onSelect: (code: string | null) => void;
}) {
  const { t, locale, countryName } = useI18n();
  const reduced = usePrefersReducedMotion();

  // Register the projection data once per GeoJSON payload. Idempotent.
  useMemo(() => {
    echarts.registerMap("world", geo as never);
  }, [geo]);

  const byCode = useMemo(
    () => new Map(countries.map((c) => [c.code, c])),
    [countries],
  );

  const items = useMemo<MapItem[]>(() => {
    return geo.features.map((f) => {
      const rec = byCode.get(f.properties.code);
      const base: MapItem = {
        name: f.properties.name,
        code: f.properties.code,
        value: null,
      };
      if (!rec) return { ...base, itemStyle: { areaColor: THEME.mapNone } };
      if (rec.stale) {
        return {
          ...base,
          stale: true,
          year: rec.year,
          itemStyle: { areaColor: THEME.mapNone },
        };
      }
      const selected = selectedCode === rec.code;
      return {
        ...base,
        value: rec.value,
        below: rec.below,
        year: rec.year,
        itemStyle: selected
          ? { borderColor: THEME.goldBright, borderWidth: 2, areaColor: undefined }
          : undefined,
      };
    });
  }, [geo, byCode, selectedCode]);

  const option = useMemo<ChartOption>(() => {
    return {
      backgroundColor: "transparent",
      tooltip: {
        ...baseTooltip(),
        trigger: "item",
        formatter: (params: unknown) => {
          const p = params as { data?: MapItem };
          const d = p.data;
          if (!d) return "";
          const rec = d.code ? byCode.get(d.code) : undefined;
          const localName = countryName(rec?.a2, d.name);
          const head = `<b style="color:${THEME.cream}">${localName}</b><br/>`;
          let line: string;
          if (d.stale) {
            line = `<span style="color:${THEME.creamDim}">${t.ch3.tooltipStale.replace("{year}", String(d.year))}</span>`;
          } else if (rec == null || d.value == null) {
            line = `<span style="color:${THEME.creamDim}">${t.ch3.tooltipNoData}</span>`;
          } else if (d.below) {
            line = `<span style="color:${THEME.creamDim}">${t.ch3.tooltipBelow}</span>`;
          } else {
            line = `${t.ch3.tooltipIndicator}: <b style="color:${THEME.goldBright}">${d.value.toFixed(1)}%</b> <span style="color:${THEME.creamDim}">(${d.year})</span>`;
          }
          const src = `<br/><span style="color:#7a8f84;font-size:11px">${t.ch3.tooltipSource}</span>`;
          return head + line + src;
        },
      },
      visualMap: {
        type: "piecewise",
        show: false,
        seriesIndex: 0,
        pieces: [
          { max: 2.5, color: THEME.mapScale[0] },
          { min: 2.5, max: 5, color: THEME.mapScale[1] },
          { min: 5, max: 10, color: THEME.mapScale[2] },
          { min: 10, max: 20, color: THEME.mapScale[3] },
          { min: 20, max: 35, color: THEME.mapScale[4] },
          { min: 35, color: THEME.mapScale[5] },
        ],
      },
      series: [
        {
          type: "map",
          map: "world",
          roam: false,
          data: items,
          itemStyle: { borderColor: THEME.ink, borderWidth: 0.4 },
          emphasis: {
            label: { show: false },
            itemStyle: { areaColor: "#2e463c" },
          },
          select: { disabled: true },
        },
      ],
    };
  }, [items, byCode, t, locale, countryName]);

  // clear ECharts' internal hover/selection when the panel is cleared
  useEffect(() => {
    // option rebuild (via selectedCode) already handles the visual state
  }, [selectedCode]);

  return (
    <BaseChart
      option={option}
      ariaLabel={`${t.ch3.mapTitle}. ${t.ch3.legendTitle}. ${t.common.chartAriaFallback}`}
      animation={!reduced}
      style={{ height: "clamp(420px, 62vh, 620px)", width: "100%" }}
      events={{
        click: (params) => {
          const d = (params as { data?: MapItem }).data;
          onSelect(d?.code ?? null);
        },
      }}
    />
  );
}
