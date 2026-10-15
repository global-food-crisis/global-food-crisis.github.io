// Locale-aware number formatting helpers shared by charts and tables.
// Words come from the i18n dictionaries so both locales stay natural.

import type { Dictionary } from "@/i18n/en";

type Common = Dictionary["common"];

/** 147.4 → "147.4 million people" / "1.474 億人" */
export function formatPeople(millions: number, c: Common, locale: string): string {
  if (locale === "zh-TW") {
    if (millions >= 100) {
      const yi = (millions / 100).toLocaleString("zh-TW", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
      return `${yi} ${c.hundredMillionPeople}`;
    }
    const wan = Math.round(millions * 100).toLocaleString("zh-TW");
    return `${wan} ${c.tenThousandPeople}`;
  }
  const v = millions.toLocaleString("en-US", { maximumFractionDigits: 1 });
  return `${v} ${c.millionPeople}`;
}

/** 7.8 → "7.8%" (both locales use ASCII %) */
export function formatPercent(v: number, locale: string): string {
  return `${v.toLocaleString(locale, { maximumFractionDigits: 1 })}%`;
}

/** Plain localized number (no unit). */
export function formatNumber(v: number, locale: string, digits = 1): string {
  return v.toLocaleString(locale, { maximumFractionDigits: digits });
}

/** "19 countries" / "19 個國家" */
export function formatCountries(n: number, c: Common): string {
  return `${n} ${c.countriesUnit}`;
}
