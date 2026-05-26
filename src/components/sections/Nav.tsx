"use client";

import { useEffect, useState } from "react";

import { copy } from "@/content/copy";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/Nav.tsx";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { nav } = copy;

  return (
    <header
      data-component="Nav"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-text,color-border,color-accent,radius-pill"
      data-scrolled={scrolled ? "true" : "false"}
      className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4"
    >
      <div
        className="nav-pill flex w-full items-center justify-between gap-2 rounded-full pl-4 pr-2 md:w-auto md:justify-start"
        style={{
          height: "56px",
          backgroundColor: scrolled
            ? "rgba(255, 255, 255, 0.85)"
            : "rgba(255, 255, 255, 0.72)",
          border: "1px solid rgba(0, 0, 0, 0.07)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
          boxShadow: scrolled
            ? "0 6px 22px rgba(0, 0, 0, 0.08)"
            : "0 4px 14px rgba(0, 0, 0, 0.05)",
          transition:
            "background-color 200ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <a
          href="#top"
          aria-label="Corder, home"
          className="inline-flex items-center gap-2"
        >
          <CorderMark />
          <span
            className="font-serif text-[18px] font-medium md:hidden"
            style={{ color: "var(--color-text)", letterSpacing: "-0.01em" }}
          >
            Corder
          </span>
        </a>

        <span
          aria-hidden
          className="mx-2 hidden h-5 w-px md:block"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
        />

        <nav className="hidden items-center gap-1 md:flex">
          {nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link px-3 py-2 text-[15px] font-medium"
              style={{ color: "var(--color-text-muted)" }}
            >
              {link.label}
            </a>
          ))}
          {/* Account link removed from nav per user request 2026-05-25.
           *  /account still reachable via direct URL and the post-
           *  magic-link redirect; just no top-level nav entry until
           *  the auth gating in Phase 3 puts it back conditionally. */}
        </nav>

        <a
          href="https://github.com/halinskiy/corder-updates/releases/latest/download/Corder.zip"
          download="Corder.zip"
          data-component="NavCta"
          data-source={DATA_SOURCE}
          data-tokens="radius-pill,color-accent,color-bg,ease-out"
          data-track-event="cta_download_click"
          data-track-source="nav"
          className="nav-cta ml-2 hidden h-10 items-center gap-2 rounded-full px-5 text-[15px] font-medium md:inline-flex"
          style={{
            border: "1px solid var(--color-accent)",
            color: "var(--color-bg)",
            backgroundColor: "var(--color-accent)",
          }}
        >
          {nav.ctaPrimary}
        </a>

        {/* Mobile: compact CTA only */}
        <a
          href="https://github.com/halinskiy/corder-updates/releases/latest/download/Corder.zip"
          download="Corder.zip"
          data-component="NavCta"
          data-source={DATA_SOURCE}
          data-tokens="radius-pill,color-accent,color-bg,ease-out"
          data-track-event="cta_download_click"
          data-track-source="nav"
          className="nav-cta ml-2 inline-flex h-10 items-center gap-2 rounded-full px-4 text-[14px] font-medium md:hidden"
          style={{
            border: "1px solid var(--color-accent)",
            color: "var(--color-bg)",
            backgroundColor: "var(--color-accent)",
          }}
        >
          Download for Mac
        </a>
      </div>
    </header>
  );
}

function CorderMark() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 1024 1024"
      aria-hidden="true"
      role="img"
      style={{
        filter:
          "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.06)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.05))",
      }}
    >
      {/* Canonical Corder mark (bordered variant). Source of truth:
       *  /Users/3mpq/corder-brand/corder-mark-bordered.svg. Updated
       *  2026-05-26 from the old 312/552 + 160x600 rx=44 geometry to
       *  the new 340/540 + 144x528 rx=72 capsule bars on a white
       *  squircle (rx=227, 12% hairline, 6 px stroke inset). */}
      <rect
        x="6"
        y="6"
        width="1012"
        height="1012"
        rx="227"
        ry="227"
        fill="#ffffff"
        stroke="rgba(0, 0, 0, 0.12)"
        strokeWidth="12"
      />
      <rect x="340" y="248" width="144" height="528" rx="72" ry="72" fill="#111111" />
      <rect x="540" y="248" width="144" height="528" rx="72" ry="72" fill="#111111" />
    </svg>
  );
}
