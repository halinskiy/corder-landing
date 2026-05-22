import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";

import { MotionProvider } from "@/components/providers/MotionProvider";
import { PauseOffscreen } from "@/components/providers/PauseOffscreen";
import { CorderPresenceProvider } from "@/components/presence/CorderPresence";

import { copy } from "@/content/copy";

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

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  openGraph: {
    title: copy.meta.ogTitle,
    description: copy.meta.ogDescription,
    type: "website",
    locale: "en_US",
    siteName: "Corder",
  },
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
