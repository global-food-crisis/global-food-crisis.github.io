"use client";

// Lazy JSON loading for chart/map data.
// - fetch starts only when the container approaches the viewport
//   (IntersectionObserver), keeping the initial page light;
// - loading / error / retry states are exposed so every visualization can
//   render meaningful alternatives instead of spinning forever.

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { assetUrl } from "./basePath";

export type LazyResult<T> = {
  status: "idle" | "loading" | "error" | "ready";
  data: T | null;
  error: string | null;
  /** Attach to the placeholder element that triggers loading on approach. */
  ref: React.RefObject<HTMLDivElement | null>;
  retry: () => void;
};

export function useLazyJson<T>(path: string, rootMargin = "400px"): LazyResult<T> {
  const [status, setStatus] = useState<LazyResult<T>["status"]>("idle");
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);

  const load = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setStatus("loading");
    setError(null);
    fetch(assetUrl(path))
      .then((resp) => {
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        return resp.json() as Promise<T>;
      })
      .then((json) => {
        setData(json);
        setStatus("ready");
      })
      .catch((err: unknown) => {
        startedRef.current = false;
        setStatus("error");
        setError(err instanceof Error ? err.message : String(err));
      });
  }, [path]);

  const retry = useCallback(() => {
    startedRef.current = false;
    load();
  }, [load]);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      // deferred so setStatus is never called synchronously in the effect body
      const id = window.setTimeout(load, 0);
      return () => window.clearTimeout(id);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          load();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [load, rootMargin]);

  return { status, data, error, ref, retry };
}

/** Reduced-motion preference (live-updated, SSR-safe). */
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeMotion(onChange: () => void): () => void {
  const mq = window.matchMedia(MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(MOTION_QUERY).matches,
    () => false,
  );
}
