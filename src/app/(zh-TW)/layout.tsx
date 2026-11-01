import type { Metadata } from "next";
import { Fraunces, Inter, Newsreader } from "next/font/google";
import "../globals.css";
import { LanguageProvider } from "@/i18n";
import { SITE_URL } from "@/lib/site";
import { zhTW } from "@/i18n/zh-TW";

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
  title: zhTW.meta.siteTitle,
  description: zhTW.meta.siteDescription,
  icons: { icon: "/favicon.svg" },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/zh-TW/",
    languages: {
      en: "/",
      "zh-TW": "/zh-TW/",
      "x-default": "/",
    },
  },
  openGraph: {
    title: zhTW.meta.siteTitle,
    description: zhTW.meta.siteDescription,
    type: "website",
    url: "/zh-TW/",
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
    <html lang="zh-TW" className="no-js" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: earlyPrefs }} />
      </head>
      <body
        className={`${fraunces.variable} ${newsreader.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        <LanguageProvider initialLocale="zh-TW" routeBound>{children}</LanguageProvider>
      </body>
    </html>
  );
}
