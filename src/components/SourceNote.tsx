"use client";

// SourceNote — inline citation line rendered near claims and visualizations:
//   "Source: FAO, SOFI 2026 (reference year 2025)"
// Keeps provenance on the page itself, not only in the references section.

import { useI18n } from "@/i18n";

export function SourceNote({
  name,
  url,
  year,
  children,
}: {
  name: string;
  url?: string;
  year?: string | number;
  children?: React.ReactNode;
}) {
  const { t } = useI18n();
  return (
    <p className="source-note">
      <span className="label">{t.common.sourceLabel}</span>
      <span>
        {url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            {name}
          </a>
        ) : (
          name
        )}
        {year !== undefined ? ` — ${t.common.refYear}: ${year}` : ""}
        {children}
      </span>
    </p>
  );
}
