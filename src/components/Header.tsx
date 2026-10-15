"use client";

// Header — fixed top bar with wordmark, scrollspy chapter navigation and the
// EN / 繁體中文 language switch. All links are real anchors so the story works
// with JavaScript disabled (progressive enhancement).

import { useEffect, useState } from "react";
import { useI18n, type Locale } from "@/i18n";

const SECTION_IDS = ["ch1", "ch2", "ch3", "ch4", "ch5", "ch6"];

export function Header() {
  const { locale, t, setLocale } = useI18n();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        // the last section intersecting above the middle of the viewport wins
        const candidates = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (candidates.length > 0) {
          const idx = sections.indexOf(candidates[0].target as HTMLElement);
          if (idx >= 0) setActive(idx);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const switchTo = (next: Locale) => (e: React.MouseEvent) => {
    e.preventDefault();
    setLocale(next);
  };

  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <a href="#top" className="wordmark">
          {t.nav.wordmarkTop}
          <small>{t.nav.wordmarkBottom}</small>
        </a>
        <nav className="chapter-nav" aria-label={t.nav.navAria}>
          {t.nav.chapters.map((label, i) => (
            <a key={SECTION_IDS[i]} href={`#${SECTION_IDS[i]}`} aria-current={active === i}>
              {label}
            </a>
          ))}
        </nav>
        <div
          className="lang-switch"
          role="group"
          aria-label={t.nav.langSwitchLabel}
          title={t.nav.langSwitchAria}
        >
          <button
            type="button"
            aria-pressed={locale === "en"}
            onClick={locale === "en" ? undefined : switchTo("en")}
            lang="en"
          >
            EN
          </button>
          <button
            type="button"
            aria-pressed={locale === "zh-TW"}
            onClick={locale === "zh-TW" ? undefined : switchTo("zh-TW")}
            lang="zh-TW"
          >
            繁中
          </button>
        </div>
      </div>
    </header>
  );
}
