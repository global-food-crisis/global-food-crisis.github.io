"use client";

// ChartHint — a persistent, low-key affordance line rendered near every
// interactive chart. The copy comes from the i18n dictionaries as a template
// with a {verb} placeholder; the verb adapts to the detected input modality
// (touch → "tap", mouse → "hover", hybrid → both), so the instruction always
// matches what the visitor's device can actually do. Never a popup, never
// hover-only text: it is plain visible copy in the page language.

import { useI18n } from "@/i18n";
import { useInputModality } from "@/lib/useInputModality";

export function ChartHint({ template }: { template: string }) {
  const { t } = useI18n();
  const modality = useInputModality();
  const verb =
    modality === "touch"
      ? t.common.hintVerbTap
      : modality === "mouse"
        ? t.common.hintVerbHover
        : t.common.hintVerbBoth;
  return <p className="chart-hint">{template.replace("{verb}", verb)}</p>;
}
