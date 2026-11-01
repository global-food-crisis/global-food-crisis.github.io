"use client";

// Global Food Crisis — Chapter 01.
// Assembles the six chapters: The Question, The Scale, The Geography,
// The Causes, The Trend, The Action. All content is bilingual (EN / zh-TW)
// through the LanguageProvider; data loads lazily per visualization.

import { useI18n } from "@/i18n";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Scale } from "@/components/sections/Scale";
import { Geography } from "@/components/sections/Geography";
import { Causes } from "@/components/sections/Causes";
import { Trend } from "@/components/sections/Trend";
import { Action } from "@/components/sections/Action";

export default function Home() {
  const { t } = useI18n();
  return (
    <>
      <a className="skip-link" href="#main">
        {t.nav.skipToContent}
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Scale />
        <Geography />
        <Causes />
        <Trend />
        <Action />
      </main>
      <Footer />
    </>
  );
}
