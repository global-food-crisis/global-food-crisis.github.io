"use client";

// Reveal — progressive disclosure of narrative blocks via IntersectionObserver.
// With prefers-reduced-motion (or no JS), content is simply visible.

import { useEffect, useRef, useState } from "react";

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "p" | "figure";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      // deferred so we never call setState synchronously inside the effect
      const id = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(id);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ ["--reveal-delay" as never]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
