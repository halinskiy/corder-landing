"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { copy } from "@/content/copy";
import { AppleIcon } from "@/components/icons/AppleIcon";

const DATA_SOURCE = "projects/corder-landing/src/components/sections/Nav.tsx";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  // Mobile burger menu. The floating pill reads as an island that covers
  // content on small screens, so below md the nav is a plain full-width
  // bar: brand left, burger right, links in an animated dropdown.
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);
  // The nav also mounts on subpages (/case). There the section anchors
  // don't exist, so links lead back to the homepage sections and the
  // brand goes home instead of scrolling to #top. On the homepage
  // everything behaves exactly as before.
  const pathname = usePathname();
  const onHome = pathname === "/" || pathname === null;

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
    <>
    <header
      data-component="Nav"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-text,color-border,color-accent,radius-pill"
      data-scrolled={scrolled ? "true" : "false"}
      className="pointer-events-none fixed inset-x-0 top-0 z-40 hidden justify-center px-4 pt-4 md:flex"
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
          href={onHome ? "#top" : "/"}
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
              href={
                link.href.startsWith("#")
                  ? onHome
                    ? link.href
                    : `/${link.href}`
                  : link.href
              }
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

      </div>
    </header>

    {/* ── Mobile: plain full-width bar + animated burger menu ───────── */}
    <header
      data-component="NavMobile"
      data-source={DATA_SOURCE}
      className="fixed inset-x-0 top-0 z-40 md:hidden"
    >
      <div className="nav-mbar">
        <a
          href={onHome ? "#top" : "/"}
          aria-label="Corder, home"
          className="inline-flex items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <CorderMark />
          <span className="nav-mbar__brand">Corder</span>
        </a>
        <button
          type="button"
          className={`nav-burger${open ? " is-open" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            key="mnav"
            className="nav-msheet"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
          >
            {nav.links.map((link, i) => (
              <motion.a
                key={link.href}
                href={
                  link.href.startsWith("#")
                    ? onHome
                      ? link.href
                      : `/${link.href}`
                    : link.href
                }
                className="nav-msheet__link"
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: 0.08 + i * 0.05,
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  },
                }}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="/install/"
              data-track-event="cta_download_click"
              data-track-source="nav-mobile"
              className="nav-msheet__cta cta-pill cta-pill--primary inline-flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] text-[16px] font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.08 + nav.links.length * 0.05,
                  duration: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                },
              }}
              onClick={() => setOpen(false)}
            >
              <AppleIcon size={20} />
              {nav.ctaPrimary}
            </motion.a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
    </>
  );
}

function CorderMark() {
  // 3D Tahoe-style brand mark, cut from assets/corder-mark-3d-2048.png. The
  // PNG carries its own drop shadow in the alpha channel, so no CSS filter.
  //
  // srcSet, not a lone 128: the file this pointed at had been crushed to 2 KB,
  // and on an image that is entirely gradients and soft shadows that reads as
  // mush (reported 2026-07-17). 128 now covers 1x honestly; 2x and 3x take the
  // 256. See BRAND-MARK.md before touching the logo anywhere.
  return (
    <img
      src="/brand-mark-128.png"
      srcSet="/brand-mark-128.png 1x, /brand-mark-256.png 2x"
      width={32}
      height={32}
      alt=""
      aria-hidden="true"
      decoding="async"
      style={{ display: "block" }}
    />
  );
}
