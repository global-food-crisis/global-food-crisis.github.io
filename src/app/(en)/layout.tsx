import type { Metadata } from "next";
import { Fraunces, Inter, Newsreader } from "next/font/google";
import "../globals.css";
import { LanguageProvider } from "@/i18n";
import { SITE_URL } from "@/lib/site";

// Self-hosted variable fonts (loaded at build time — no runtime CDN).
// CJK text falls back to system fonts (PingFang TC / Microsoft JhengHei /
// Noto Sans TC / Songti TC) declared in globals.css.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Global Food Crisis — Chapter 01: The World Has Food. Why Does Hunger Persist?",
  description:
    "An open, evidence-based interactive story about global hunger: its scale, geography, causes, trends and what one person can do. Data from FAO, WFP, IPC and UNEP.",
  icons: { icon: "/favicon.svg" },
  robots: { index: true, follow: true },
  alternates: {
    // Consolidates the three reachable origins (apex, www, github.io — the
    // latter two 301 here) into one canonical URL for search engines.
    canonical: "/",
    languages: {
      en: "/",
      "zh-TW": "/zh-TW/",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "Global Food Crisis — Chapter 01",
    description:
      "The world grows more calories than its people need — yet hundreds of millions still go hungry. An evidence-based interactive story.",
    type: "website",
    url: "/",
  },
};

// Enable reveal animations when JavaScript is available.
const earlyPrefs = `document.documentElement.classList.remove("no-js");`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="no-js" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: earlyPrefs }} />
      </head>
      <body
        className={`${fraunces.variable} ${newsreader.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        <LanguageProvider initialLocale="en" routeBound>{children}</LanguageProvider>
      </body>
    </html>
  );
}
