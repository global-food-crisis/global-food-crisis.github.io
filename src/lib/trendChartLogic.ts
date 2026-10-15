// trendChartLogic — pure, shared logic for the Chapter 5 trend chart.
// Kept free of React/ECharts imports so it can be unit-tested directly
// (tests/trend-logic.test.mjs) and reused by the chart, its legend and the
// region selection chips.

export type TrendPoint = { year: number; value: number; below?: boolean };

export type RegionKey = "africa" | "asia" | "americas" | "europe" | "oceania";

export const REGION_KEYS: RegionKey[] = [
  "africa",
  "asia",
  "americas",
  "europe",
  "oceania",
];

export type TrendData = {
  worldPercent: TrendPoint[];
  worldNumber: TrendPoint[];
  sofi2026: { percent: TrendPoint[]; number: TrendPoint[] };
  regions: Record<RegionKey, TrendPoint[]>;
};

// Fixed series identity -> color. Every surface (curve, data points, legend
// icon, selection-chip dot, tooltip marker) resolves through this one map,
// so a region's color can never depend on selection order or array index.
// Values are the colors the curves already used before this map existed.
export const WORLD_COLOR = "#e0c48f"; // gold bright — matches the world curve

export const REGION_COLORS: Record<RegionKey, string> = {
  africa: "#c05b3b", // rust — also the map's highest-intensity class
  asia: "#8fa074", // sage
  americas: "#ce8b54", // ochre
  europe: "#b4c9be", // mist (dashed when at the FAO reporting floor)
  oceania: "#6e7f74", // slate
};

export type SeriesKey = "world" | RegionKey;

export function seriesColor(key: SeriesKey): string {
  return key === "world" ? WORLD_COLOR : REGION_COLORS[key];
}

/**
 * Y-axis upper bound for the percent view. Always a multiple of 5 so the
 * axis can use a clean, fixed 5-point interval, and always at least the
 * largest visible value — regions like Africa (15.5–22.1%) must never be
 * clipped by an axis ceiling chosen for the world series alone (max 13%).
 */
export function nicePercentMax(values: number[]): number {
  const maxVal = values.length > 0 ? Math.max(...values) : 0;
  return Math.max(10, Math.ceil(maxVal / 5) * 5);
}

/**
 * True when every point of a series carries the FAO reporting-floor flag
 * (`below: true`, set by the data pipeline from FAO's documented "<2.5%"
 * convention — see docs/methodology.md). Such a series is drawn dashed and
 * labelled "<2.5%": its flat 2.5 line marks the measurement floor, not an
 * exact observation of 2.5% every year.
 */
export function isThresholdFloorSeries(points: TrendPoint[]): boolean {
  return points.length > 0 && points.every((p) => p.below === true);
}
