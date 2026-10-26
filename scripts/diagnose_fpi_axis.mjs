// Diagnose: numeric years on a category axis (ECharts 6.1.0) — reproduces the
// exact option shape used by PriceIndexChart.tsx and inspects layout results.
// Data path resolves relative to this script (scripts/ -> repo root), so it
// works from any working directory on Linux, macOS and Windows.
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  GridComponent,
  MarkLineComponent,
  MarkPointComponent,
  TooltipComponent,
} from "echarts/components";
import { SVGRenderer } from "echarts/renderers";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

echarts.use([
  LineChart,
  GridComponent,
  MarkLineComponent,
  MarkPointComponent,
  TooltipComponent,
  SVGRenderer,
]);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.resolve(__dirname, "../public/data/food-price-index.json");

const data = JSON.parse(readFileSync(DATA_PATH, "utf8"));
const series = data.series; // [{year: 2000, value: 53.7}, ...]

function runCase(label, { xAxisData, lineData, markCoord }) {
  const chart = echarts.init(null, null, {
    renderer: "svg",
    ssr: true,
    width: 800,
    height: 360,
  });
  chart.setOption({
    grid: { left: 8, right: 18, top: 26, bottom: 8, containLabel: true },
    xAxis: {
      type: "category",
      data: xAxisData,
      boundaryGap: false,
    },
    yAxis: { type: "value", min: 40, max: 160 },
    series: [
      {
        type: "line",
        data: lineData,
        markLine: { data: [{ yAxis: 100 }] },
        markPoint: { data: [{ coord: markCoord }] },
      },
    ],
  });

  const model = chart.getModel();
  const lineSeries = model.getSeriesByIndex(0);
  const list = lineSeries.getData();

  const points = [];
  const n = list.count();
  for (let i = 0; i < n; i++) {
    const raw = list.getItemVisual ? null : null; // placeholder
    const layout = list.getItemLayout(i);
    points.push(layout);
  }

  // X axis category positions
  const xAxisModel = model.getComponent("xAxis", 0);
  const xScale = xAxisModel.axis.scale;

  // markPoint layout
  const svg = chart.renderToSVGString();
  const polylineMatches = [...svg.matchAll(/<path[^>]*class="[^"]*line[^"]*"[^>]*>/g)];
  const pathD = svg.match(/d="M[^"]+"/g);

  // svg background rect / empty check
  const hasLinePath = /class="[^"]*\bline\b[^"]*"/.test(svg) || pathD;

  console.log(`\n===== CASE: ${label} =====`);
  console.log("data count:", n);
  const layouts = points.slice(0, 5).concat(points.slice(-3));
  console.log("first/last point layouts (px):", JSON.stringify(layouts));
  const nullCount = points.filter((p) => !p || Number.isNaN(p[0]) || Number.isNaN(p[1])).length;
  console.log("null/NaN layouts:", nullCount, "/", n);

  const peak = series.reduce((a, b) => (b.value > a.value ? b : a));
  try {
    const idx = xScale.parse ? undefined : undefined;
    // check how the scale resolves the peak year value
    const normalized = xScale.normalize(peak.year);
    console.log("xScale.normalize(2022) →", normalized, "(category fraction; NaN/undefined = unresolvable)");
  } catch (e) {
    console.log("xScale.normalize(2022) threw:", e.message);
  }
  console.log("scale domain (first/last):", xScale.getOrdinalMeta
    ? undefined
    : JSON.stringify([xScale.getDomain ? xScale.getDomain()[0] : null,
                       xScale.getDomain ? xScale.getDomain()[xScale.getDomain().length - 1] : null]));
  console.log("SVG contains drawn line path:", Boolean(hasLinePath), "| pathD count:", pathD ? pathD.length : 0);
  chart.dispose();
}

const peak = series.reduce((a, b) => (b.value > a.value ? b : a));

// CASE 1 — current production code: numeric years everywhere on category axis
runCase("numeric years on category axis (current code)", {
  xAxisData: series.map((d) => d.year),
  lineData: series.map((d) => [d.year, d.value]),
  markCoord: [peak.year, peak.value],
});

// CASE 2 — proposed fix: string years
runCase("string years on category axis (proposed fix)", {
  xAxisData: series.map((d) => String(d.year)),
  lineData: series.map((d) => [String(d.year), d.value]),
  markCoord: [String(peak.year), peak.value],
});
