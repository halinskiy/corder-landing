import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";

import { MotionProvider } from "@/components/providers/MotionProvider";
import { PauseOffscreen } from "@/components/providers/PauseOffscreen";
import { CorderPresenceProvider } from "@/components/presence/CorderPresence";
import { ConsentProvider } from "@/components/consent/ConsentProvider";
import { CookieConsentButton } from "@/components/consent/CookieConsentButton";
import { BackToHomeBtn } from "@/components/ui/BackToHomeBtn";

import { copy } from "@/content/copy";
import { PADDLE_ENV, PADDLE_TOKEN } from "@/lib/paddle";

import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-serif",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const SITE_URL = "https://getcorder.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Title template: child pages can set their own title and Next.js will
  // wrap it. The home page sets `title: copy.meta.title` directly (no template).
  title: {
    default: copy.meta.title,
    template: "%s | Corder",
  },
  description: copy.meta.description,
  applicationName: "Corder",
  authors: [{ name: "Corder", url: SITE_URL }],
  creator: "Corder",
  publisher: "Corder",
  keywords: [
    "mac meeting recorder",
    "macOS meeting recorder",
    "record zoom call",
    "record google meet",
    "record microsoft teams",
    "meeting transcription",
    "speaker labels",
    "no bot meeting recorder",
    "private meeting recorder",
    "local meeting transcription",
    "gemini transcription",
    "corder app",
  ],
  category: "productivity",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: copy.meta.ogTitle,
    description: copy.meta.ogDescription,
    type: "website",
    locale: "en_US",
    siteName: "Corder",
    url: SITE_URL,
    images: [
      {
        url: "/og-image.png",
        // secureUrl is the same value as url since the site is https-
        // only. Older LinkedIn / Slack scrapers still look for this
        // explicit `og:image:secure_url` tag and skip the preview
        // when only `og:image` is set.
        secureUrl: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Corder. Record what was said. The Mac meeting recorder. No bot in the call.",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: copy.meta.ogTitle,
    description: copy.meta.ogDescription,
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    // Pinned colour for browser UI (Chrome address bar, Safari header,
    // PWA status bar). Matches `--color-bg` so the mobile status area
    // visually continues the page background instead of carrying the
    // accent green, which read as a coloured header strip on mobile.
    "theme-color": "#ffffff",
  },
};

// JSON-LD structured data: SoftwareApplication + Organization + WebSite.
// Embedded as a single <script type="application/ld+json"> in the head so
// Googlebot picks it up without parsing JavaScript.
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: "Corder",
      url: SITE_URL,
      applicationCategory: ["BusinessApplication", "ProductivityApplication"],
      operatingSystem: "macOS 14",
      description: copy.meta.description,
      image: `${SITE_URL}/og-image.png`,
      softwareVersion: "0.14.23",
      downloadUrl: `${SITE_URL}/install/`,
      featureList: copy.features.cells.map((c) => c.heading).join(", "),
      offers: [
        {
          "@type": "Offer",
          name: "Free",
          price: "0",
          priceCurrency: "USD",
          category: "free",
          description:
            "5 hours of transcription a month, speaker labels, searchable transcript. No credit card, no sign-up.",
        },
        {
          "@type": "Offer",
          name: "Pro Monthly",
          price: "10",
          priceCurrency: "USD",
          description:
            "25 hours a month, auto-summary, custom templates, priority support. $10/mo first 3 months, $14/mo after.",
        },
        {
          "@type": "Offer",
          name: "Pro Annual",
          price: "99",
          priceCurrency: "USD",
          description:
            "$99 billed yearly. Locks $8.25/mo effective rate. Price locked forever.",
        },
        {
          "@type": "Offer",
          name: "Max Monthly",
          price: "24",
          priceCurrency: "USD",
          description:
            "Unlimited transcription, stronger accents handling, early builds. $24/mo first 3 months, $29/mo after.",
        },
        {
          "@type": "Offer",
          name: "Max Annual",
          price: "239",
          priceCurrency: "USD",
          description:
            "$239 billed yearly. Locks $19.92/mo effective rate. Price locked forever.",
        },
      ],
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "Corder",
      url: SITE_URL,
      logo: `${SITE_URL}/icon-512.png`,
      // sameAs builds the brand-entity cluster Google uses for the
      // Knowledge Graph. Without it the @getcorder Twitter account
      // and the halinskiy GitHub aren't linked to getcorder.com in
      // search.
      sameAs: ["https://x.com/getcorder", "https://github.com/halinskiy"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#site`,
      url: SITE_URL,
      name: "Corder",
      publisher: { "@id": `${SITE_URL}/#org` },
      inLanguage: "en",
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: copy.faq.items.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ],
};

// Synchronous pre-hydration script: read `?motion=0` and `prefers-reduced-motion`
// before first paint and set <html data-motion="off"> so global CSS short-circuits
// any motion (including native CSS animation-timeline scroll-driven work). Runs
// before any React work so AudienceLine words never flash in their initial state.
const MOTION_BOOTSTRAP_SCRIPT = `(function(){try{var s=new URLSearchParams(location.search).get('motion')==='0';var r=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(s||r){document.documentElement.dataset.motion='off';}}catch(e){}})();`;

// Keep the browser's native back/forward scroll restoration ON. The footer
// links (Contact, legal) are full-page navigations on this static export; the
// browser remembers the scroll position and restores it on Back. The Next
// runtime can flip history.scrollRestoration to 'manual'; this forces it back
// to 'auto' on every load and on bfcache restore so Back returns you to where
// you were, not the top of the page.
const SCROLL_RESTORATION_SCRIPT = `(function(){try{if('scrollRestoration' in history){history.scrollRestoration='auto';addEventListener('pageshow',function(){history.scrollRestoration='auto';});}}catch(e){}})();`;

// Analytics (Microsoft Clarity, X / Twitter conversion pixel, Plausible
// Analytics) MOVED out of <head> on 2026-05-28. They now load only after
// the user clicks Accept in the cookie consent banner; the consent state
// is read from localStorage and the scripts are injected dynamically from
// src/components/consent/ConsentProvider.tsx. This makes the site
// GDPR-compliant for EU visitors out of the box.
//
// Preconnect hints below stay -- they're zero-cost and just save the TLS
// handshake when the user later opts in.
const TWQ_ID = process.env.NEXT_PUBLIC_TWQ_ID;
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

// Paddle.js v2 init. Wrapped in DOMContentLoaded so the deferred
// paddle.js external (see <script defer> below) has finished loading
// before the init reads `window.Paddle`. Deferred scripts run BEFORE
// DOMContentLoaded fires, so this listener is the safe place to
// initialise. `eventCallback` forwards `checkout.completed` into
// Plausible + Twitter pixel so the ad funnel can attribute the
// conversion.
const PADDLE_INIT_SCRIPT = `document.addEventListener("DOMContentLoaded",function(){try{Paddle.Environment.set(${JSON.stringify(PADDLE_ENV)});Paddle.Initialize({token:${JSON.stringify(PADDLE_TOKEN)},eventCallback:function(d){if(d&&d.name==="checkout.completed"){try{if(window.plausible)window.plausible("checkout_completed");if(window.twq)window.twq("event","tw-checkout-completed",{});}catch(e){}}}});}catch(e){console.error("Paddle init failed",e);}});`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={copy.meta.lang}
      className={`${plexSans.variable} ${plexSerif.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect: Clarity + (when configured) Twitter pixel CDN +
         * Plausible. Saves the TLS handshake on the first beacon, which
         * Lighthouse estimated at ~240ms for Clarity alone. */}
        <link rel="preconnect" href="https://www.clarity.ms" crossOrigin="" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        {TWQ_ID && (
          <>
            <link rel="preconnect" href="https://static.ads-twitter.com" crossOrigin="" />
            <link rel="preconnect" href="https://analytics.twitter.com" crossOrigin="" />
          </>
        )}
        {PLAUSIBLE_DOMAIN && (
          <link rel="preconnect" href="https://plausible.io" crossOrigin="" />
        )}
        {/* Paddle CDN -- preconnect saves TLS handshake on the first
            checkout-open click. The checkout iframe pulls from
            buy.paddle.com / buy.sandbox.paddle.com depending on env. */}
        <link rel="preconnect" href="https://cdn.paddle.com" crossOrigin="" />
        <link rel="preconnect" href="https://buy.paddle.com" crossOrigin="" />
        <link rel="preconnect" href="https://buy.sandbox.paddle.com" crossOrigin="" />
        {/* Structured data: SoftwareApplication + Organization + WebSite.
         * Inline before scripts so Googlebot encounters it early in HEAD. */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: MOTION_BOOTSTRAP_SCRIPT }}
        />
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: SCROLL_RESTORATION_SCRIPT }}
        />
        {/* Clarity / Twitter pixel / Plausible loaders MOVED to
            ConsentProvider so they fire only after the user clicks
            Accept in the cookie banner. The TWQ_ID / PLAUSIBLE_DOMAIN
            env refs above are kept so the ConsentProvider can read
            them at runtime via process.env. */}
        {/* Paddle.js v2 -- deferred so the external script stops
            blocking parse + first paint. Saves ~200-400 ms TBT on
            mobile per the 2026-05-27 SEO audit. The init script
            below wraps its body in a DOMContentLoaded listener,
            which fires AFTER the deferred external has executed,
            so `window.Paddle` is guaranteed ready at init time.
            Sandbox / production switch lives in `src/lib/paddle.ts`. */}
        <script defer src="https://cdn.paddle.com/paddle/v2/paddle.js" />
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: PADDLE_INIT_SCRIPT }}
        />
      </head>
      <body>
        <PauseOffscreen />
        <MotionProvider>
          <CorderPresenceProvider>{children}</CorderPresenceProvider>
        </MotionProvider>
        {/* GDPR consent banner. Renders only when no decision is
            stored. On accept, dynamically injects Clarity / X pixel /
            Plausible loaders. */}
        <ConsentProvider />
        {/* Persistent bottom-left cookie-preferences trigger. Visible
            on every page so the user can re-decide at any time;
            hidden while the banner itself is on screen. */}
        <CookieConsentButton />
        {/* Persistent top-left back-to-home affordance. Mirror of the
            cookie trigger -- same ghost circle, opposite corner.
            Renders on every page except home (the component decides). */}
        <BackToHomeBtn />
      </body>
    </html>
  );
}
