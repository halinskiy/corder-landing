"use client";

import { useEffect, useState } from "react";

import { copy } from "@/content/copy";
import { AppleIcon } from "@/components/icons/AppleIcon";

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
      className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4"
    >
      <div
        className="nav-pill pointer-events-auto flex w-full items-center justify-between gap-2 rounded-full pl-4 pr-2 md:w-auto md:justify-start"
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

        {/* Desktop Download. Granola-style scroll state: transparent
            at the top of the page (just text + apple icon in accent
            colour, no fill), fills with accent green once the user
            scrolls past 8px. The hero CTA below the fold provides the
            primary affordance until then, so the nav stays quiet. */}
        <a
          href="/install/"
          data-component="NavCta"
          data-source={DATA_SOURCE}
          data-tokens="radius-pill,color-accent,color-bg,ease-out"
          data-track-event="cta_download_click"
          data-track-source="nav"
          className="nav-cta nav-cta--scroll-state ml-2 hidden h-10 items-center gap-1.5 rounded-full pl-3.5 pr-5 text-[15px] font-medium md:inline-flex"
        >
          <AppleIcon size={20} />
          {nav.ctaPrimary}
        </a>

        {/* Mobile: compact CTA only */}
        <a
          href="/install/"
          data-component="NavCta"
          data-source={DATA_SOURCE}
          data-tokens="radius-pill,color-accent,color-bg,ease-out"
          data-track-event="cta_download_click"
          data-track-source="nav"
          className="nav-cta nav-cta--scroll-state ml-2 inline-flex h-10 items-center gap-1.5 rounded-full pl-3 pr-4 text-[14px] font-medium md:hidden"
        >
          <AppleIcon size={18} />
          {nav.ctaPrimaryMobile}
        </a>
      </div>
    </header>
  );
}

function CorderMark() {
  // 3D Tahoe-style brand mark (rasterised 2048 -> 128 by
  // scripts/generate-seo-assets.mjs). Displayed at 32 px so the 128
  // source covers up to 4x retina. PNG carries its own drop shadow
  // baked into the alpha channel -- no CSS filter needed.
  return (
    <img
      src="/brand-mark-128.png"
      width={32}
      height={32}
      alt=""
      aria-hidden="true"
      decoding="async"
      style={{ display: "block" }}
    />
  );
}
