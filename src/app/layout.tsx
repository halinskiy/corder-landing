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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={copy.meta.lang}
      className={`${plexSans.variable} ${plexSerif.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Clarity is loaded via the IIFE below; pre-resolve the DNS + TLS
         * handshake so the first beacon doesn't block the main thread on a
         * cold connection. Lighthouse estimated ~240ms savings. */}
        <link rel="preconnect" href="https://www.clarity.ms" crossOrigin="" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: MOTION_BOOTSTRAP_SCRIPT }}
        />
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: CLARITY_SCRIPT }}
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
