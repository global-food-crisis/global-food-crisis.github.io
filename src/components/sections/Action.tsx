"use client";

// Action — Chapter 6. Interest-based selector (accordion) with realistic,
// non-guilt-based recommendations, verified external resources, and the
// honest food-waste caveat. Ends with the closing statement.

import { useState } from "react";
import { useI18n } from "@/i18n";
import { Reveal } from "../Reveal";

export function Action() {
  const { t } = useI18n();
  const [open, setOpen] = useState<string>("learn");

  return (
    <section id="ch6" className="chapter" aria-label={t.nav.chapterLabels[5]}>
      <div className="shell">
        <Reveal>
          <p className="kicker">{t.ch6.kicker}</p>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="h-chapter">{t.ch6.title}</h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="lede" style={{ marginTop: "1.1rem" }}>
            {t.ch6.lede}
          </p>
        </Reveal>

        <Reveal>
          <div style={{ marginTop: "1.8rem" }}>
            <p
              className="chart-title"
              style={{ margin: 0, fontSize: "0.95rem" }}
              id="action-selector-label"
            >
              {t.ch6.selectorLabel}
            </p>
            <p className="chart-subtitle">{t.ch6.selectorHint}</p>
          </div>
        </Reveal>

        <div className="action-selector" aria-labelledby="action-selector-label">
          {t.ch6.interests.map((interest) => {
            const action = t.ch6.actions.find((a) => a.id === interest.id);
            if (!action) return null;
            const isOpen = open === interest.id;
            const panelId = `action-panel-${interest.id}`;
            return (
              <Reveal key={interest.id} className="action-item" delay={40}>
                <h3 style={{ margin: 0 }}>
                  <button
                    type="button"
                    className="action-item__btn"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? "" : interest.id)}
                  >
                    {interest.label}
                    <span className="arrow" aria-hidden="true">
                      ▸
                    </span>
                  </button>
                </h3>
                <div className="action-item__panel" id={panelId} hidden={!isOpen}>
                  <p className="body">{action.body}</p>
                  <p className="caveat">{action.caveat}</p>
                  <ul className="resource-list">
                    {action.resources.map((r) => (
                      <li key={r.url}>
                        <a href={r.url} target="_blank" rel="noopener noreferrer">
                          {r.name} ↗
                        </a>
                        <span className="note">{r.note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="closing-block">
            <p className="closing-block__title">{t.ch6.closingTitle}</p>
            <p className="closing-block__body">{t.ch6.closingBody}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
