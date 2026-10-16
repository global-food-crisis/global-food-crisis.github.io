"use client";

// Hero — Chapter 1 (The Question). Full-viewport opener with the verified
// headline statistic (static value, source and reference year — never a live
// counter), the food-supply counterpoint, and the question itself.

import { useI18n } from "@/i18n";
import { Reveal } from "../Reveal";
import { SourceNote } from "../SourceNote";

export function Hero() {
  const { t } = useI18n();
  return (
    <>
      <section id="ch1" className="hero" aria-label={t.nav.chapterLabels[0]}>
        <div className="hero-grid" aria-hidden="true">
          <svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hg" width="88" height="88" patternUnits="userSpaceOnUse">
                <path
                  d="M88 0H0v88"
                  fill="none"
                  stroke="rgba(242,241,232,0.045)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hg)" />
          </svg>
        </div>

        {/* padding-top is set in globals.css (.hero > .shell) so it can clear
            the fixed header per breakpoint (mobile header is two rows tall). */}
        <div className="shell hero__shell">
          <Reveal>
            <p className="kicker hero-kicker">{t.ch1.kicker}</p>
          </Reveal>
          <Reveal delay={70}>
            <h1 className="h-display hero-title">{t.ch1.title}</h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="lede hero-lede">{t.ch1.lede}</p>
          </Reveal>

          <Reveal delay={210}>
            <div className="hero-stat" style={{ marginTop: "2.4rem", maxWidth: "760px" }}>
              <p style={{ margin: 0 }}>
                <span className="stat-number">{t.ch1.heroStatValue}</span>{" "}
                <span className="stat-unit">{t.ch1.heroStatUnit}</span>
              </p>
              <p
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "1.02rem",
                  color: "var(--cream-dim)",
                  margin: "0.5rem 0 0",
                  maxWidth: "58ch",
                }}
              >
                {t.ch1.heroStatDetail}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "0.84rem",
                  color: "var(--cream-dim)",
                  margin: "0.9rem 0 0",
                  maxWidth: "66ch",
                }}
              >
                {t.ch1.heroStatNote}
              </p>
              <SourceNote name={t.ch1.heroStatSource} year={2025} />
            </div>
          </Reveal>

          <div className="hero-facts">
            <Reveal delay={60}>
              <div className="card" style={{ maxWidth: "480px" }}>
                <p className="stat-number" style={{ fontSize: "clamp(1.9rem, 1.4rem + 1.4vw, 2.5rem)" }}>
                  {t.ch1.fact2Value}
                </p>
                <p className="stat-unit" style={{ margin: "0.2rem 0 0.5rem" }}>
                  {t.ch1.fact2Unit}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: "0.86rem",
                    lineHeight: 1.6,
                    color: "var(--cream-dim)",
                    margin: 0,
                  }}
                >
                  {t.ch1.fact2Detail}
                </p>
                <SourceNote name={t.ch1.fact2Source} year={2023} />
              </div>
            </Reveal>
            <Reveal delay={140}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  paddingBottom: "1.2rem",
                  minWidth: "220px",
                }}
              >
                <a className="scroll-cue" href="#ch1-body">
                  {t.ch1.scrollCue}
                  <span className="arrow" aria-hidden="true">
                    ↓
                  </span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="ch1-body" className="chapter chapter--tinted">
        <div className="shell">
          <div className="prose-editorial">
            <Reveal>
              <h2 className="h-sub">{t.ch1.p1Title}</h2>
              <p>{t.ch1.p1}</p>
            </Reveal>
            <Reveal delay={60}>
              <p className="dim">{t.ch1.p2}</p>
            </Reveal>
            <Reveal delay={120}>
              <p>{t.ch1.p3}</p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
