// tests/trend-logic.test.mjs — unit tests for the Chapter 5 chart logic
// (src/lib/trendChartLogic.ts) and the data contract it depends on.
//
// Run with: bun tests/trend-logic.test.mjs   (also part of `bun run validate`)
//
// Guards the two Chapter 5 fixes:
//   1. Region colors are fixed per region id — never assigned by selection
//      order or array index (legend/curve/chip/tooltip consistency).
//   2. The percent-view y-axis ceiling adapts to visible series so Africa
//      (15.5–22.1%) can never be clipped by a ceiling chosen for the world
//      series alone — and stays a multiple of 5 for clean ticks.
// Plus the FAO "<2.5%" reporting-floor semantics carried in trend.json.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  REGION_KEYS,
  REGION_COLORS,
  WORLD_COLOR,
  seriesColor,
  nicePercentMax,
  isThresholdFloorSeries,
} from "../src/lib/trendChartLogic.ts";

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log(`  ✓ ${name}`);
};

console.log("trend-logic tests:");

test("fixed color map covers world + all five regions", () => {
  assert.equal(WORLD_COLOR, "#e0c48f");
  assert.deepEqual([...REGION_KEYS], ["africa", "asia", "americas", "europe", "oceania"]);
  for (const key of REGION_KEYS) {
    assert.match(REGION_COLORS[key], /^#[0-9a-f]{6}$/i, `bad color for ${key}`);
  }
});

test("every series color is unique (distinguishable on dark background)", () => {
  const all = [WORLD_COLOR, ...REGION_KEYS.map((k) => REGION_COLORS[k])];
  assert.equal(new Set(all).size, 6);
});

test("seriesColor is stable regardless of selection order", () => {
  const subset = ["asia", "africa", "europe"]; // arbitrary order
  for (const key of subset) {
    assert.equal(seriesColor(key), REGION_COLORS[key]);
  }
  // selecting/deselecting never changes any region's color
  const before = Object.fromEntries(REGION_KEYS.map((k) => [k, seriesColor(k)]));
  const after = Object.fromEntries(["europe", "africa"].map((k) => [k, seriesColor(k)]));
  for (const k of Object.keys(after)) assert.equal(after[k], before[k]);
  assert.equal(seriesColor("world"), WORLD_COLOR);
});

test("nicePercentMax clears every visible series and keeps multiples of 5", () => {
  assert.equal(nicePercentMax([]), 10); // degenerate: lowest sensible axis
  assert.equal(nicePercentMax([13]), 15); // world alone
  assert.equal(nicePercentMax([13, 6.7]), 15); // world + asia
  assert.equal(nicePercentMax([13, 22.1]), 25); // world + africa — no clipping
  assert.equal(nicePercentMax([13, 22.1, 14.9, 6.5, 2.5, 7.6]), 25); // all regions
  assert.equal(nicePercentMax([30]), 30); // exact multiple stays
  assert.equal(nicePercentMax([30.01]), 35);
});

test("nicePercentMax always exceeds the largest visible value (no clipping)", () => {
  const world = [12.7, 7.5, 8.2];
  const africa = Array.from({ length: 25 }, (_, i) => 15.5 + (i % 7));
  for (const v of africa) {
    assert.ok(nicePercentMax([...world, v]) >= v, `axis clipped at ${v}`);
  }
});

test("isThresholdFloorSeries: only all-flagged series count as the FAO floor", () => {
  const floor = [{ year: 2000, value: 2.5, below: true }, { year: 2001, value: 2.5, below: true }];
  const mixed = [{ year: 2000, value: 2.5, below: true }, { year: 2001, value: 2.6 }];
  const plain = [{ year: 2000, value: 2.5 }, { year: 2001, value: 2.5 }];
  assert.equal(isThresholdFloorSeries(floor), true);
  assert.equal(isThresholdFloorSeries(mixed), false);
  assert.equal(isThresholdFloorSeries(plain), false); // value 2.5 alone is NOT enough
  assert.equal(isThresholdFloorSeries([]), false);
});

test("trend.json contract: europe is the flagged FAO floor, others are not", () => {
  const trend = JSON.parse(readFileSync(new URL("../public/data/trend.json", import.meta.url), "utf8"));
  const { regions } = trend;
  assert.ok(regions.europe.length > 0 && regions.europe.every((p) => p.below === true));
  assert.ok(regions.europe.every((p) => p.value === 2.5));
  for (const key of ["africa", "asia", "americas", "oceania"]) {
    assert.ok(regions[key].every((p) => p.below !== true), `${key} unexpectedly flagged`);
  }
});

test("trend.json contract: africa values stay above the former fixed ceiling (14)", () => {
  const trend = JSON.parse(readFileSync(new URL("../public/data/trend.json", import.meta.url), "utf8"));
  const min = Math.min(...trend.regions.africa.map((p) => p.value));
  assert.ok(min > 14, `africa min ${min} would be clipped by the old axis`);
});

console.log(`\n${passed} tests passed, 0 failures`);
