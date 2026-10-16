"use client";

// Input-modality detection for interaction hints.
// Uses the any-pointer / any-hover media queries (not the primary-pointer
// pair) so hybrid devices — touch laptops, tablets with a trackpad —
// resolve to "both" instead of silently hiding one input. Live-updated via
// useSyncExternalStore (same pattern as usePrefersReducedMotion); the server
// snapshot is the neutral "both".

import { useSyncExternalStore } from "react";

export type InputModality = "touch" | "mouse" | "both";

const HOVER_QUERY = "(any-hover: hover)";
const COARSE_QUERY = "(any-pointer: coarse)";

function subscribeModality(onChange: () => void): () => void {
  const hover = window.matchMedia(HOVER_QUERY);
  const coarse = window.matchMedia(COARSE_QUERY);
  hover.addEventListener("change", onChange);
  coarse.addEventListener("change", onChange);
  return () => {
    hover.removeEventListener("change", onChange);
    coarse.removeEventListener("change", onChange);
  };
}

function getModalitySnapshot(): InputModality {
  const hover = window.matchMedia(HOVER_QUERY).matches;
  const coarse = window.matchMedia(COARSE_QUERY).matches;
  if (hover && coarse) return "both";
  if (coarse) return "touch";
  if (hover) return "mouse";
  return "both";
}

export function useInputModality(): InputModality {
  return useSyncExternalStore(
    subscribeModality,
    getModalitySnapshot,
    () => "both",
  );
}
