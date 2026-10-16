"use client";

// Header — fixed top bar with wordmark, scrollspy chapter navigation and the
// EN / 繁體中文 language switch. All links are real anchors so the story works
// with JavaScript disabled (progressive enhancement).
//
// Responsive layout: desktop keeps a single row (wordmark | nav | language).
// At <=900px the bar becomes two rows via flex-wrap: row 1 = wordmark +
// language, row 2 = the full-width chapter nav as a horizontal scroller with
// a chevron button and edge fades (data-at-start / data-at-end) so all six
// chapters are discoverable on phones. The .chapter-nav-row wrapper uses
// `display: contents` on desktop, so the desktop layout is untouched.

import { useEffect, useRef, useState } from "react";
import { useI18n, type Locale } from "@/i18n";

const SECTION_IDS = ["ch1", "ch2", "ch3", "ch4", "ch5", "ch6"];

export function Header() {
  const { locale, t, setLocale } = useI18n();
  const [active, setActive] = useState(0);
  const navRef = useRef<HTMLElement | null>(null);
  // Scroller affordance state. Defaults assume scrollLeft = 0 (matches the
  // pre-hydration / no-JS rendering: right fade + chevron visible, no left fade).
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

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

  // --- horizontal chapter scroller (mobile) -------------------------------
  const updateNavScrollState = () => {
    const el = navRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  };

  useEffect(() => {
    updateNavScrollState();
    window.addEventListener("resize", updateNavScrollState);
    return () => window.removeEventListener("resize", updateNavScrollState);
  }, []);

  // Keep the scrollspy-active chapter visible in the scroller (mobile).
  useEffect(() => {
    const el = navRef.current;
    const link = el?.children[active] as HTMLElement | undefined;
    if (!el || !link) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    link.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [active]);

  const scrollNavForward = () => {
    const el = navRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.8, behavior: "smooth" });
  };

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
        <div
          className="chapter-nav-row"
          data-at-start={atStart}
          data-at-end={atEnd}
        >
          <nav
            className="chapter-nav"
            aria-label={t.nav.navAria}
            ref={navRef as never}
            onScroll={updateNavScrollState}
          >
            {t.nav.chapters.map((label, i) => (
              <a key={SECTION_IDS[i]} href={`#${SECTION_IDS[i]}`} aria-current={active === i}>
                {label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            className="nav-more"
            aria-label={t.nav.moreChapters}
            title={t.nav.moreChapters}
            onClick={scrollNavForward}
            disabled={atEnd}
          >
            <svg
              viewBox="0 0 12 12"
              width="10"
              height="10"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M3.5 1.5 L8.5 6 L3.5 10.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
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
