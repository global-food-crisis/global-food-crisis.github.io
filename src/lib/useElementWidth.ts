"use client";

// useElementWidth — tracks an element's rendered width with a ResizeObserver
// so charts can adapt labels to the space they actually get (the acute chart
// hides per-bar coverage labels on narrow screens, the drivers chart switches
// to a compact grid). Width is 0 until the first measurement (SSR-safe);
// observing always fires one initial callback with the current size.

import { useEffect, useRef, useState } from "react";

export function useElementWidth(): [
  React.RefObject<HTMLDivElement | null>,
  number,
] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[entries.length - 1]?.contentRect.width;
      if (typeof w !== "number") return;
      const rounded = Math.round(w);
      setWidth((prev) => (prev === rounded ? prev : rounded));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, width];
}
