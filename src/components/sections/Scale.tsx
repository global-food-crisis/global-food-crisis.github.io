"use client";

// Scale — Chapter 2. Four indicator cards that keep the four hunger measures
// strictly separate (definition / methodology / limitations expandable),
// the "never add these numbers" warning, a chronic-vs-acute yardstick
// diagram, and the child-malnutrition footnote.

import { useI18n } from "@/i18n";
import { Reveal } from "../Reveal";
import { SourceNote } from "../SourceNote";

// Decorative spike heights ∝ GRFC Phase 3+ series 2016–2025
// (105.3, 123.5, 112.8, 137.4, 159.0, 192.8, 257.8, 281.6, 295.8, 265.7 M).
const ACUTE_SHAPE = [36, 42, 38, 47, 54, 65, 87, 95, 100, 90];

export function Scale() {
  const { t } = useI18n();
  return (
    <section id="ch2" className="chapter" aria-label={t.nav.chapterLabels[1]}>
      <div className="shell">
        <Reveal>
          <p className="kicker">{t.ch2.kicker}</p>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="h-chapter">{t.ch2.title}</h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="lede" style={{ marginTop: "1.1rem" }}>
            {t.ch2.lede}
          </p>
        </Reveal>

        <div className="indicator-grid">
          {t.ch2.indicators.map((ind, i) => (
            <Reveal
              key={ind.id}
              delay={i * 60}
              as="article"
              className={`card indicator-card${i === 0 || i === 3 ? " card--gold" : ""}`}
            >
              <h3 className="indicator-card__name">{ind.name}</h3>
              <p className="indicator-card__def">{ind.shortDef}</p>
              <p className="stat-number indicator-card__value">{ind.value}</p>
              <p className="indicator-card__unit">{ind.unit}</p>
              <details>
                <summary>{t.common.expand}</summary>
                <dl>
                  <div>
                    <dt>{t.ch2.defLabel}</dt>
                    <dd>{ind.definition}</dd>
                  </div>
                  <div>
                    <dt>{t.ch2.metLabel}</dt>
                    <dd>{ind.methodology}</dd>
                  </div>
                  <div>
                    <dt>{t.ch2.limLabel}</dt>
                    <dd>{ind.limitations}</dd>
                  </div>
                </dl>
              </details>
              <SourceNote name={ind.sourceName} url={ind.sourceUrl} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="caveat" role="note" style={{ marginTop: "2.4rem" }}>
            <strong>{t.ch2.neverAddTitle}.</strong> {t.ch2.neverAddBody}
          </div>
        </Reveal>

        <Reveal>
          <div style={{ marginTop: "2.8rem" }}>
            <h3 className="h-sub">{t.ch2.diagramTitle}</h3>
            <div className="yardstick" aria-hidden={false}>
              <div className="yardstick-panel">
                <p className="yardstick-panel__axis">{t.ch2.diagramChronicAxis}</p>
                <div className="yardstick-panel__strip" aria-hidden="true">
                  <span className="flat" />
                </div>
                <p className="yardstick-panel__desc">{t.ch2.diagramChronicDesc}</p>
              </div>
              <div className="yardstick-panel">
                <p className="yardstick-panel__axis">{t.ch2.diagramAcuteAxis}</p>
                <div className="yardstick-panel__strip" aria-hidden="true">
                  {ACUTE_SHAPE.map((h, i) => (
                    <span
                      key={i}
                      className={`spike${i >= 6 ? " hot" : ""}`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <p className="yardstick-panel__desc">{t.ch2.diagramAcuteDesc}</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <aside className="card" style={{ marginTop: "2.4rem" }}>
            <p
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "0.88rem",
                lineHeight: 1.65,
                color: "var(--cream)",
                margin: 0,
                maxWidth: "68ch",
              }}
            >
              {t.ch2.popNote}
            </p>
            <SourceNote name={t.ch2.popNoteSource} url={t.ch2.popNoteSourceUrl} />
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
