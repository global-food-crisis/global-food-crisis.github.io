"use client";

// Language provider — client-side localization with persistent preference.
// English is the default; selection is stored in localStorage (no cookies,
// no tracking). Official organization names keep their recognized forms.

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { en, type Dictionary } from "./en";
import { zhTW } from "./zh-TW";

export type Locale = "en" | "zh-TW";

const DICTS: Record<Locale, Dictionary> = { en, "zh-TW": zhTW };

type I18nContextValue = {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
  /** Localized country name from ISO alpha-2 (falls back to English name). */
  countryName: (a2: string | undefined, fallback: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "gfc.language";

function isValidLocale(value: string | null): value is Locale {
  return value === "en" || value === "zh-TW";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Restore a stored preference on mount (client only; deferred to a
  // microtask so hydration completes before the state swap).
  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (isValidLocale(stored)) setLocaleState(stored);
      } catch {
        /* storage unavailable (private mode / blocked) — keep default */
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  // Keep <html lang> and the document title in sync with the locale.
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = DICTS[locale].meta.siteTitle;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const countryName = useCallback(
    (a2: string | undefined, fallback: string) => {
      if (!a2) return fallback;
      try {
        const dn = new Intl.DisplayNames([locale], { type: "region" });
        return dn.of(a2) ?? fallback;
      } catch {
        return fallback;
      }
    },
    [locale],
  );

  const value = useMemo<I18nContextValue>(
    () => ({ locale, t: DICTS[locale], setLocale, countryName }),
    [locale, setLocale, countryName],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <LanguageProvider>");
  return ctx;
}
