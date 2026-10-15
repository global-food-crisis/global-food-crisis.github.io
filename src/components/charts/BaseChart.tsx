"use client";

// BaseChart — shared ECharts lifecycle: init, resize (ResizeObserver),
// dispose, option updates on data/locale/motion changes, web-font re-render.
// Modular imports keep the bundle to the chart types actually used.

import { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { BarChart, LineChart, MapChart, ScatterChart } from "echarts/charts";
import {
  DataZoomComponent,
  DataZoomInsideComponent,
  DataZoomSliderComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  VisualMapPiecewiseComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  BarChart,
  LineChart,
  MapChart,
  ScatterChart,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  VisualMapPiecewiseComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
  DataZoomSliderComponent,
  CanvasRenderer,
]);

export type ChartOption = echarts.EChartsCoreOption;

/** Shared palette (kept in sync with globals.css). */
export const THEME = {
  ink: "#101a18",
  ink2: "#192721",
  ink3: "#21302a",
  cream: "#f2f1e8",
  creamDim: "#b4c9be",
  gold: "#c7a36c",
  goldBright: "#e0c48f",
  line: "rgba(242,241,232,0.12)",
  goldLine: "rgba(199,163,108,0.38)",
  mapNone: "#26352f",
  fontUi:
    '"Inter", system-ui, -apple-system, "Segoe UI", "PingFang TC", "Microsoft JhengHei", "Noto Sans TC", sans-serif',
  /** choropleth classes, low → high */
  mapScale: ["#3f5449", "#5c7b60", "#8fa074", "#c7a36c", "#ce8b54", "#c05b3b"],
};

export function baseTooltip(): echarts.TooltipComponentOption {
  return {
    backgroundColor: "#101a18",
    borderColor: "rgba(199,163,108,0.45)",
    borderWidth: 1,
    padding: [10, 14],
    textStyle: {
      color: THEME.cream,
      fontFamily: THEME.fontUi,
      fontSize: 13,
    },
    extraCssText: "box-shadow: 0 6px 24px rgba(0,0,0,0.45); border-radius: 8px; max-width: 300px; white-space: normal;",
  };
}

export function BaseChart({
  option,
  ariaLabel,
  animation = true,
  className,
  style,
  events,
}: {
  option: ChartOption;
  ariaLabel: string;
  animation?: boolean;
  className?: string;
  style?: React.CSSProperties;
  events?: Record<string, (params: unknown) => void>;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const optionRef = useRef(option);
  const animationRef = useRef(animation);
  const eventsRef = useRef(events);

  // keep refs in sync with the latest props (after render, before use)
  useEffect(() => {
    optionRef.current = option;
    animationRef.current = animation;
    eventsRef.current = events;
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const chart = echarts.init(el, null, { renderer: "canvas" });
    chartRef.current = chart;

    const apply = () => {
      chart.setOption({ ...optionRef.current, animation: animationRef.current }, { notMerge: true });
    };
    apply();

    // re-render once web fonts finish loading (canvas text)
    const fontsReady = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts;
    if (fontsReady) {
      fontsReady.ready.then(() => {
        if (chartRef.current) apply();
      }).catch(() => undefined);
    }

    const resize = () => chart.resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    window.addEventListener("resize", resize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resize);
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  // attach/re-attach event handlers with latest closures
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const entries = Object.entries(eventsRef.current ?? {});
    const offs: Array<() => void> = [];
    for (const [name, handler] of entries) {
      const fn = (params: unknown) => handler(params);
      chart.on(name, fn);
      offs.push(() => chart.off(name, fn));
    }
    return () => offs.forEach((off) => off());
  });

  // update option when it changes (new data, locale, motion preference)
  useEffect(() => {
    chartRef.current?.setOption(
      { ...option, animation } as echarts.EChartsCoreOption,
      { notMerge: true },
    );
  }, [option, animation]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={ariaLabel}
      className={className}
      style={style}
    />
  );
}
