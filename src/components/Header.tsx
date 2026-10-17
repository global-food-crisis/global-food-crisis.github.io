"use client";

// Header — fixed top bar with wordmark, scrollspy chapter navigation and the
// EN / 繁體中文 language switch. All links are real anchors so the story works
// with JavaScript disabled (progressive enhancement).
//
// Responsive layout: desktop keeps a single row (wordmark | nav | language).
// At <=900px the bar becomes two rows via flex-wrap: row 1 = wordmark +
// language, row 2 = the full-width chapter nav as a horizontal scroller.
//
// Chapter scroller affordance: left and right arrow buttons flank the nav
// whenever it actually overflows (data-overflow, measured from JS), following
// the Remember to Prevent pattern. With overflow present both arrows stay
// visible; the one at a boundary is disabled with a clear dimmed state. When
// all links fit, the arrows (and edge fades) hide completely. The arrows are
// keyboard-accessible real buttons, respect prefers-reduced-motion, and
// boundaries are re-measured on scroll, resize, orientation change, font load
// and language change (label widths differ per locale). The
// .chapter-nav-row wrapper uses `display: contents` on desktop, so the
// desktop layout is untouched unless the nav truly overflows there.

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useI18n, type Locale } from "@/i18n";

const SECTION_IDS = ["ch1", "ch2", "ch3", "ch4", "ch5", "ch6"];

// useLayoutEffect logs a warning during prerender; fall back to useEffect on
// the server so the initial measurement runs before first paint on clients.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function Header() {
  const { locale, t, setLocale } = useI18n();
  const [active, setActive] = useState(0);
  const navRef = useRef<HTMLElement | null>(null);
  // Scroller affordance state. Defaults assume scrollLeft = 0 (matches the
  // pre-hydration / no-JS rendering: no overflow detected → arrows hidden,
  // touch scrolling and anchor links still fully work).
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [canScroll, setCanScroll] = useState(false);

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

  // --- horizontal chapter scroller (arrows + fades) ------------------------
  const updateNavScrollState = useCallback(() => {
    const el = navRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanScroll(max > 4);
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(max <= 4 || el.scrollLeft >= max - 2);
  }, []);

  // Re-measure on: initial layout (before paint), scroller scroll, element /
  // viewport resize (covers orientation changes), webfont load, and language
  // change (t identity changes when the locale swaps, and localized labels
  // have different widths).
  useIsomorphicLayoutEffect(() => {
    const el = navRef.current;
    if (!el) return;
    updateNavScrollState();
    el.addEventListener("scroll", updateNavScrollState, { passive: true });
    const ro = new ResizeObserver(updateNavScrollState);
    ro.observe(el);
    window.addEventListener("resize", updateNavScrollState);
    window.addEventListener("orientationchange", updateNavScrollState);
    if (typeof document !== "undefined" && document.fonts?.ready) {
      void document.fonts.ready.then(() => updateNavScrollState());
    }
    return () => {
      el.removeEventListener("scroll", updateNavScrollState);
      ro.disconnect();
      window.removeEventListener("resize", updateNavScrollState);
      window.removeEventListener("orientationchange", updateNavScrollState);
    };
  }, [updateNavScrollState, t]);

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

  const scrollNav = (direction: 1 | -1) => {
    const el = navRef.current;
    if (!el) return;
    const amount = Math.max(160, el.clientWidth * 0.8);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * amount, behavior: reduced ? "auto" : "smooth" });
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
          data-overflow={canScroll}
        >
          <NavArrow
            label={t.nav.navScrollPrev}
            disabled={!canScroll || atStart}
            onClick={() => scrollNav(-1)}
            path="M8.5 1.5 L3.5 6 L8.5 10.5"
          />
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
          <NavArrow
            label={t.nav.navScrollNext}
            disabled={!canScroll || atEnd}
            onClick={() => scrollNav(1)}
            path="M3.5 1.5 L8.5 6 L3.5 10.5"
          />
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

function NavArrow({
  label,
  disabled,
  onClick,
  path,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  path: string;
}) {
  return (
    <button
      type="button"
      className="nav-arrow"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
    >
      <svg
        viewBox="0 0 12 12"
        width="10"
        height="10"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
