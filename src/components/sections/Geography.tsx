"use client";

// Geography — Chapter 3. Interactive choropleth of undernourishment
// prevalence with country search/selection, an explicit no-data state,
// localized tooltips, regional 2025 snapshots, an accessible data table,
// and honest reading notes. Map area is never equated with people.

import { useMemo, useState } from "react";
import { useI18n } from "@/i18n";
import { useLazyJson } from "@/lib/useLazyData";
import { Reveal } from "../Reveal";
import { SourceNote } from "../SourceNote";
import { ChartHint } from "../ChartHint";
import {
  WorldMap,
  MAP_BREAKS,
  MAP_NONE,
  type PouRecord,
  type WorldGeo,
} from "../charts/WorldMap";

type PouFile = { meta: Record<string, unknown>; countries: PouRecord[] };

export function Geography() {
  const { t, locale, countryName } = useI18n();
  const pou = useLazyJson<PouFile>("/data/pou-country.json");
  const geo = useLazyJson<WorldGeo>("/data/world-map.json");

  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const countries = pou.data?.countries ?? null;
  const ready = pou.status === "ready" && geo.status === "ready";
  const failed = pou.status === "error" || geo.status === "error";

  const nameOf = (c: PouRecord) => countryName(c.a2, c.name);

  const selectedRec = useMemo(
    () => (selected && countries ? countries.find((c) => c.code === selected) : undefined),
    [selected, countries],
  );

  const searchOptions = useMemo(() => {
    if (!countries) return [];
    return countries.map((c) => ({ label: nameOf(c), code: c.code, en: c.name }));
  }, [countries, locale, countryName]);

  const onSearch = (value: string) => {
    setQuery(value);
    const hit = searchOptions.find(
      (o) =>
        o.label.toLowerCase() === value.toLowerCase() ||
        o.en.toLowerCase() === value.toLowerCase(),
    );
    if (hit) setSelected(hit.code);
  };

  // ---- data table ----
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState<"value" | "name">("value");
  const rows = useMemo(() => {
    if (!countries) return [];
    const f = filter.trim().toLowerCase();
    const list = countries.filter((c) => {
      if (!f) return true;
      return (
        nameOf(c).toLowerCase().includes(f) || c.name.toLowerCase().includes(f)
      );
    });
    const sorted = [...list].sort((a, b) => {
      if (sort === "name") return nameOf(a).localeCompare(nameOf(b), locale);
      if (a.value !== b.value) return b.value - a.value;
      return nameOf(a).localeCompare(nameOf(b), locale);
    });
    return sorted;
  }, [countries, filter, sort, locale, countryName]);

  const errorCard = (
    <div className="chart-status">
      <p style={{ margin: 0, color: "var(--cream)", fontWeight: 600 }}>
        {t.common.errorTitle}
      </p>
      <p style={{ margin: 0, maxWidth: "44ch" }}>{t.common.errorBody}</p>
      <button type="button" className="link-btn" onClick={() => { pou.retry(); geo.retry(); }}>
        {t.common.retry}
      </button>
    </div>
  );

  return (
    <section id="ch3" className="chapter chapter--tinted" aria-label={t.nav.chapterLabels[2]}>
      <div className="shell">
        <Reveal>
          <p className="kicker">{t.ch3.kicker}</p>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="h-chapter">{t.ch3.title}</h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="lede" style={{ marginTop: "1.1rem" }}>
            {t.ch3.lede}
          </p>
        </Reveal>

        <Reveal>
          <div style={{ marginTop: "2.4rem" }}>
            <ChartHint template={t.ch3.chartsIntro} />
          </div>
        </Reveal>

        <Reveal>
          <div className="chart-frame" style={{ marginTop: "1.1rem" }}>
            <div className="chart-frame__head">
              <h3 className="chart-title">{t.ch3.mapTitle}</h3>
              <p className="chart-subtitle">{t.ch3.mapSubtitle}</p>
              <ChartHint template={t.ch3.mapHint} />
            </div>

            <div className="map-controls">
              <div className="map-search">
                <input
                  type="search"
                  list="gfc-country-list"
                  value={query}
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder={t.ch3.searchPlaceholder}
                  aria-label={t.ch3.searchLabel}
                />
                <datalist id="gfc-country-list">
                  {searchOptions.slice(0, 170).map((o) => (
                    <option key={o.code} value={o.label} />
                  ))}
                </datalist>
              </div>
              {query && !searchOptions.some((o) => o.label === query || o.en === query) && (
                <span className="chart-controls__hint">{t.ch3.searchNoResults}</span>
              )}
            </div>

            {ready && countries && geo.data ? (
              <WorldMap
                countries={countries}
                geo={geo.data}
                selectedCode={selected}
                onSelect={setSelected}
              />
            ) : failed ? (
              errorCard
            ) : (
              <div ref={pou.ref}>
                <div className="chart-status" ref={geo.ref}>
                  <div className="spinner" aria-hidden="true" />
                  <p style={{ margin: 0 }}>{t.common.loadingMap}</p>
                </div>
              </div>
            )}

            <div className="map-legend" style={{ marginTop: "0.9rem" }} role="list" aria-label={t.ch3.legendTitle}>
              {MAP_BREAKS.map((b) => (
                <span key={b.label} className="item" role="listitem">
                  <span className="swatch" style={{ background: b.color }} aria-hidden="true" />
                  {b.label}
                </span>
              ))}
              <span className="item" role="listitem">
                <span className="swatch" style={{ background: MAP_NONE }} aria-hidden="true" />
                {t.ch3.tooltipNoData}
              </span>
            </div>

            {selectedRec && (
              <div className="country-panel">
                <div>
                  <h4 className="country-panel__name">{nameOf(selectedRec)}</h4>
                  <p className="country-panel__meta">
                    {selectedRec.stale
                      ? t.ch3.tableStaleNote.replace("{year}", String(selectedRec.year))
                      : selectedRec.below
                        ? t.ch3.tooltipBelow
                        : `${t.ch3.tooltipIndicator} · ${t.ch3.tableYear} ${selectedRec.year}`}
                  </p>
                </div>
                <p className="stat-number country-panel__value">
                  {selectedRec.stale ? t.ch3.tooltipNoData : `${selectedRec.value.toFixed(1)}%`}
                </p>
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => {
                    setSelected(null);
                    setQuery("");
                  }}
                >
                  {t.ch3.clearSelection}
                </button>
              </div>
            )}

            <SourceNote name="FAO (SDG 2.1.1) · Our World in Data" url="https://ourworldindata.org/grapher/prevalence-of-undernourishment" year={2023} />
          </div>
        </Reveal>

        <Reveal>
          <div style={{ marginTop: "2.6rem" }}>
            <h3 className="h-sub">{t.ch3.regionTitle}</h3>
            <div className="region-cards">
              <div className="card">
                <p className="region-card__label">{t.ch3.regionAfrica}</p>
                <p className="region-card__value">{t.ch3.regionAfricaValue}</p>
                <p className="region-card__note">{t.ch3.regionAfricaNote}</p>
              </div>
              <div className="card">
                <p className="region-card__label">{t.ch3.regionAsia}</p>
                <p className="region-card__value">{t.ch3.regionAsiaValue}</p>
                <p className="region-card__note">{t.ch3.regionAsiaNote}</p>
              </div>
              <div className="card card--gold">
                <p className="region-card__label">{t.ch3.regionWorld}</p>
                <p className="region-card__value">{t.ch3.regionWorldValue}</p>
                <p className="region-card__note">{t.ch2.indicators[0].sourceName}</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div style={{ marginTop: "2.6rem" }}>
            <h3 className="h-sub" style={{ marginBottom: "0.6rem" }}>
              {t.ch3.tableCaption}
            </h3>
            <div className="map-controls" style={{ marginTop: 0, marginBottom: "0.7rem" }}>
              <div className="map-search" style={{ maxWidth: "260px" }}>
                <input
                  type="search"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder={t.ch3.tableSearchPlaceholder}
                  aria-label={t.ch3.tableSearchPlaceholder}
                />
              </div>
              <button
                type="button"
                className="chip"
                aria-pressed={sort === "value"}
                onClick={() => setSort("value")}
              >
                {t.ch3.sortByValue}
              </button>
              <button
                type="button"
                className="chip"
                aria-pressed={sort === "name"}
                onClick={() => setSort("name")}
              >
                {t.ch3.sortByName}
              </button>
            </div>
            <div className="data-table-wrap">
              <table className="data-table">
                <caption>
                  {t.ch3.mapTitle} — {t.ch3.mapSubtitle}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">{t.ch3.tableCountry}</th>
                    <th scope="col">{t.ch3.tableValue}</th>
                    <th scope="col">{t.ch3.tableYear}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => (
                    <tr
                      key={c.code}
                      onClick={() => setSelected(c.code)}
                      style={{ cursor: "pointer" }}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelected(c.code);
                        }
                      }}
                      aria-label={`${nameOf(c)} ${c.value.toFixed(1)}% ${c.year}`}
                    >
                      <td>{nameOf(c)}</td>
                      <td>
                        {c.stale
                          ? t.ch3.tooltipNoData
                          : c.below
                            ? t.ch3.tableBelow
                            : `${c.value.toFixed(1)}`}
                      </td>
                      <td>
                        {c.stale
                          ? t.ch3.tableStaleNote.replace("{year}", String(c.year))
                          : c.year}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="card" style={{ marginTop: "2.6rem" }}>
            <h3 className="chart-title" style={{ marginBottom: 0 }}>
              {t.ch3.notesTitle}
            </h3>
            <ul className="notes-list">
              {t.ch3.notes.map((n) => (
                <li key={n.slice(0, 24)}>{n}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
