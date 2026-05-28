"use client";

import { useEffect, useState } from "react";

import { openConsentBanner } from "@/components/consent/ConsentProvider";

const DATA_SOURCE =
  "projects/corder-landing/src/components/consent/CookieConsentButton.tsx";

/**
 * Persistent cookie-preferences trigger.
 *
 * Same physical footprint as the CorderPresence orb (56 px circle, 48 px
 * on mobile) but mirrored to the bottom-LEFT corner and rendered as a
 * white-with-border ghost surface. Always visible except while the
 * consent banner is currently on screen -- the banner takes the same
 * corner, we don't want them stacking.
 *
 * Click hands off to openConsentBanner(), which re-opens the banner
 * regardless of any prior decision. Required by GDPR Article 7(3): the
 * user must be able to withdraw or re-confirm consent as easily as
 * they originally gave it.
 *
 * Visibility tracking: the ConsentProvider dispatches
 *   corder:consent:banner-shown   (when state flips to "unknown")
 *   corder:consent:banner-hidden  (when state flips to accepted/declined)
 * and we toggle off-screen accordingly. Initial mount also checks the
 * live DOM so the trigger does not flash on first paint when the
 * banner is present from the start.
 */
export function CookieConsentButton() {
  // null until the post-mount effect checks whether the banner is
  // currently in the DOM. Prevents the SSR / initial-paint flash where
  // both the banner and the trigger would briefly co-exist.
  const [bannerVisible, setBannerVisible] = useState<boolean | null>(null);

  useEffect(() => {
    setBannerVisible(!!document.querySelector(".consent-banner"));

    const onShown = () => setBannerVisible(true);
    const onHidden = () => setBannerVisible(false);
    window.addEventListener("corder:consent:banner-shown", onShown);
    window.addEventListener("corder:consent:banner-hidden", onHidden);
    return () => {
      window.removeEventListener("corder:consent:banner-shown", onShown);
      window.removeEventListener("corder:consent:banner-hidden", onHidden);
    };
  }, []);

  if (bannerVisible === null || bannerVisible) return null;

  return (
    <button
      type="button"
      onClick={openConsentBanner}
      className="cookie-trigger"
      aria-label="Cookie preferences"
      title="Cookie preferences"
      data-component="CookieConsentButton"
      data-source={DATA_SOURCE}
      data-track-event="cookie_trigger_click"
    >
      <CookieIcon />
    </button>
  );
}

/* Lucide "cookie" icon, inlined -- a round biscuit with 5 chocolate-
 * chip dots. Universally recognised glyph for cookie-consent UI. */
function CookieIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
      <path d="M8.5 8.5v.01" />
      <path d="M16 15.5v.01" />
      <path d="M12 12v.01" />
      <path d="M11 17v.01" />
      <path d="M7 14v.01" />
    </svg>
  );
}
