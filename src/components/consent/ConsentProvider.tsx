"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "corder_consent";
const CLARITY_ID = "wxvv66xnvb";
const DATA_SOURCE = "projects/corder-landing/src/components/consent/ConsentProvider.tsx";

type ConsentState = "unknown" | "accepted" | "declined";

// Global declarations for clarity / twq / plausible live in
// src/lib/track.ts -- the ConsentProvider only injects script tags
// here, it never calls these globals directly.

/**
 * ConsentProvider -- GDPR-compliant consent gate.
 *
 * Hides the cookie banner if a decision is already stored. Only loads
 * Microsoft Clarity, the Twitter / X conversion pixel, and Plausible
 * Analytics AFTER the user clicks Accept. Decline keeps all three off
 * for the lifetime of that browser profile.
 *
 * Paddle.js is intentionally NOT gated: it ships no tracking cookie
 * and only mounts the checkout overlay on user-initiated click. It
 * remains in <head> in src/app/layout.tsx.
 *
 * Storage: localStorage `corder_consent` -> "accepted" | "declined".
 * The banner re-appears if the user clears site data.
 */
export function ConsentProvider() {
  const [state, setState] = useState<ConsentState>("unknown");
  const injectedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      /* localStorage blocked (private mode / corrupted) -- treat as unknown */
    }
    if (stored === "accepted") {
      setState("accepted");
    } else if (stored === "declined") {
      setState("declined");
    } else {
      setState("unknown");
    }
  }, []);

  // Inject analytics ONCE when consent flips to accepted.
  useEffect(() => {
    if (state !== "accepted") return;
    if (injectedRef.current) return;
    injectedRef.current = true;
    injectAnalytics();
  }, [state]);

  function persist(value: "accepted" | "declined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* no-op; banner will reappear next visit */
    }
    setState(value);
  }

  if (state !== "unknown") return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      aria-describedby="consent-body"
      data-component="ConsentBanner"
      data-source={DATA_SOURCE}
      data-tokens="color-bg,color-border,color-text,color-text-muted,radius-window,radius-button,ease-out"
      className="consent-banner"
    >
      <div className="consent-banner__head">
        <span className="consent-banner__eyebrow">Cookies</span>
        <h2 id="consent-title" className="consent-banner__title">
          Help improve this site
        </h2>
      </div>
      <p id="consent-body" className="consent-banner__body">
        We use Microsoft Clarity and Plausible Analytics to understand
        how this site is used. Decline and they stay off, no questions
        asked. The Mac app is unaffected either way.
      </p>
      <div className="consent-banner__actions">
        <button
          type="button"
          onClick={() => persist("accepted")}
          className="consent-banner__accept"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => persist("declined")}
          className="consent-banner__decline"
        >
          Decline
        </button>
        <a
          href="/privacy-policy/"
          className="consent-banner__policy"
        >
          Privacy
        </a>
      </div>
    </div>
  );
}

function injectAnalytics() {
  // Microsoft Clarity -- heatmaps + session replay.
  injectInline(
    `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${CLARITY_ID}");`
  );

  // X / Twitter conversion pixel (only if NEXT_PUBLIC_TWQ_ID is set).
  const twqId = process.env.NEXT_PUBLIC_TWQ_ID;
  if (twqId) {
    injectInline(
      `!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments)},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');twq('config','${twqId}');`
    );
  }

  // Plausible -- cookie-less but still privacy-gated for the EU.
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (plausibleDomain) {
    const tag = document.createElement("script");
    tag.defer = true;
    tag.setAttribute("data-domain", plausibleDomain);
    tag.src = "https://plausible.io/js/script.js";
    document.head.appendChild(tag);
    injectInline(
      `window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`
    );
  }
}

function injectInline(src: string) {
  const tag = document.createElement("script");
  tag.text = src;
  document.head.appendChild(tag);
}
