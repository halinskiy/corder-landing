import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";

import { MotionProvider } from "@/components/providers/MotionProvider";
import { PauseOffscreen } from "@/components/providers/PauseOffscreen";
import { CorderPresenceProvider } from "@/components/presence/CorderPresence";

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
    // Pinned colour for browser UI (Chrome address bar, Safari header).
    "theme-color": "#217a50",
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
      applicationCategory: "BusinessApplication",
      operatingSystem: "macOS 14",
      description: copy.meta.description,
      image: `${SITE_URL}/og-image.png`,
      softwareVersion: "0.9",
      offers: [
        {
          "@type": "Offer",
          name: "Free",
          price: "0",
          priceCurrency: "USD",
          description: "Up to 60 minutes per recording, unlimited local recordings, speaker labels.",
        },
        {
          "@type": "Offer",
          name: "Pro Monthly",
          price: "12",
          priceCurrency: "USD",
          description: "Unlimited recording length, auto-summary, priority support, early access.",
        },
        {
          "@type": "Offer",
          name: "Pro Annual",
          price: "99",
          priceCurrency: "USD",
          description: "Annual plan, billed once a year. Saves 31% vs monthly.",
        },
      ],
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "Corder",
      url: SITE_URL,
      logo: `${SITE_URL}/icon-512.png`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#site`,
      url: SITE_URL,
      name: "Corder",
      publisher: { "@id": `${SITE_URL}/#org` },
      inLanguage: "en",
    },
  ],
};

// Synchronous pre-hydration script: read `?motion=0` and `prefers-reduced-motion`
// before first paint and set <html data-motion="off"> so global CSS short-circuits
// any motion (including native CSS animation-timeline scroll-driven work). Runs
// before any React work so AudienceLine words never flash in their initial state.
const MOTION_BOOTSTRAP_SCRIPT = `(function(){try{var s=new URLSearchParams(location.search).get('motion')==='0';var r=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(s||r){document.documentElement.dataset.motion='off';}}catch(e){}})();`;

// Microsoft Clarity — heatmaps + session recordings. Project ID "wphp8abt99".
// Injected as a static <script> in <head> so it survives `output: "export"`
// (Next.js next/script doesn't fit static exports cleanly).
const CLARITY_SCRIPT = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "wphp8abt99");`;

// Twitter / X pixel (twq). Loads only when NEXT_PUBLIC_TWQ_ID is set --
// otherwise the snippet is omitted entirely so the page doesn't ship a
// non-functional vendor script. Event ID mapping lives in src/lib/track.ts.
const TWQ_ID = process.env.NEXT_PUBLIC_TWQ_ID;
const TWQ_SCRIPT = TWQ_ID
  ? `!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments)},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');twq('config','${TWQ_ID}');`
  : null;

// Plausible analytics. Privacy-first, ~1KB, cookie-less. Loads only when
// NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set. The script exposes window.plausible
// which src/lib/track.ts calls for every event.
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

// Paddle.js v2 init -- runs synchronously after the CDN script tag loads.
// `eventCallback` forwards `checkout.completed` into Plausible + Twitter
// pixel so the ad funnel can attribute the conversion. The script is
// injected in HEAD so the checkout overlay is ready by the time the user
// clicks Get Pro in Pricing.
const PADDLE_INIT_SCRIPT = `try{Paddle.Environment.set(${JSON.stringify(PADDLE_ENV)});Paddle.Initialize({token:${JSON.stringify(PADDLE_TOKEN)},eventCallback:function(d){if(d&&d.name==="checkout.completed"){try{if(window.plausible)window.plausible("checkout_completed");if(window.twq)window.twq("event","tw-checkout-completed",{});}catch(e){}}}});}catch(e){console.error("Paddle init failed",e);}`;

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
          dangerouslySetInnerHTML={{ __html: CLARITY_SCRIPT }}
        />
        {TWQ_SCRIPT && (
          <script
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: TWQ_SCRIPT }}
          />
        )}
        {PLAUSIBLE_DOMAIN && (
          <>
            <script
              defer
              data-domain={PLAUSIBLE_DOMAIN}
              src="https://plausible.io/js/script.js"
            />
            {/* Manual API + pageview-only mode: lets src/lib/track.ts fire
             * named events and prevents Plausible from double-counting the
             * pageview we send from PauseOffscreen on mount. */}
            <script
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: "window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }",
              }}
            />
          </>
        )}
        {/* Paddle.js v2 -- loaded synchronously so the init script below
            sees `window.Paddle` immediately. Sandbox/production switch
            lives in `src/lib/paddle.ts`. */}
        <script src="https://cdn.paddle.com/paddle/v2/paddle.js" />
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
      </body>
    </html>
  );
}
