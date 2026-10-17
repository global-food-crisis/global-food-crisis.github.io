"use client";

// Action — Chapter 6. Interest-based selector (accordion) with realistic,
// non-guilt-based recommendations, verified external resources, and the
// honest food-waste caveat. The "share" interest panel carries the copy-link
// control: one tap copies the canonical homepage URL, with a legacy
// execCommand fallback for older iOS Safari / non-secure contexts and a
// manual copy fallback message when the clipboard is unavailable. Ends with
// the closing statement.

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n";
import { SITE_URL } from "@/lib/site";
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
                  {interest.id === "share" && <ShareLinkBox />}
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

// Canonical homepage URL — never the current hash / query string, never the
// GitHub Pages fallback host.
const CANONICAL_URL = `${SITE_URL}/`;

function ShareLinkBox() {
  const { t } = useI18n();
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  const restoreTimer = useRef<number | null>(null);

  // Clear any pending label-restore timer when the panel unmounts.
  useEffect(
    () => () => {
      if (restoreTimer.current !== null) window.clearTimeout(restoreTimer.current);
    },
    [],
  );

  const copyLink = async () => {
    if (restoreTimer.current !== null) {
      window.clearTimeout(restoreTimer.current);
      restoreTimer.current = null;
    }
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(CANONICAL_URL);
      } else {
        legacyCopy(CANONICAL_URL);
      }
      // Success only after the clipboard operation actually resolved.
      setState("copied");
      restoreTimer.current = window.setTimeout(() => setState("idle"), 2400);
    } catch {
      setState("error");
    }
  };

  return (
    <div className="share-box">
      <p className="share-box__note">{t.ch6.copyNote}</p>
      <div className="share-box__row">
        <button
          type="button"
          className="link-btn share-box__btn"
          onClick={copyLink}
          aria-live="polite"
        >
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
            <path
              d="M6 3 h-3 a1.5 1.5 0 0 0 -1.5 1.5 v7 a1.5 1.5 0 0 0 1.5 1.5 h7 a1.5 1.5 0 0 0 1.5 -1.5 v-3 M10.5 1.5 h4 v4 M14.5 1.5 L7.5 8.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {state === "copied" ? t.ch6.copied : t.ch6.copyLink}
        </button>
        {state === "error" && (
          <p className="share-box__fallback" role="status">
            {t.ch6.copyFailed}{" "}
            <span className="share-box__url">{CANONICAL_URL}</span>
          </p>
        )}
      </div>
    </div>
  );
}

// Synchronous fallback for browsers without the async Clipboard API (older
// iOS Safari, non-secure contexts). Throws when the copy does not succeed so
// the caller can show the manual-copy message.
function legacyCopy(text: string) {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  area.setSelectionRange(0, text.length);
  const ok = document.execCommand("copy");
  document.body.removeChild(area);
  if (!ok) throw new Error("legacy copy failed");
}
