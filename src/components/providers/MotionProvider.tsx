"use client";

import { useEffect, type ReactNode } from "react";

export function MotionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const staticMode = new URLSearchParams(window.location.search).get("motion") === "0";

    // Doctrine: ?motion=0 (and prefers-reduced-motion) must override ALL motion,
    // including native CSS scroll-driven `animation-timeline: view()` work
    // (e.g. AudienceLine word-fill). We mark <html data-motion="off"> so global
    // CSS rules in globals.css can short-circuit those animations into final state.
    if (reduced || staticMode) {
      document.documentElement.dataset.motion = "off";
    }

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-motion="blur-reveal"]'),
    ).filter((el) => !el.dataset.motionState);

    if (reduced || staticMode) {
      targets.forEach((el) => {
        el.dataset.motionState = staticMode ? "visible-static" : "reduced";
      });
      return;
    }

    targets.forEach((el) => {
      el.dataset.motionState = "initial";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const idx = Number(el.dataset.motionIndex ?? 0);
            const delay = Math.min(idx, 10) * 60;
            window.setTimeout(() => {
              el.dataset.motionState = "visible";
            }, delay);
            observer.unobserve(el);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}
