import { Fit } from "@/components/sections/Fit";
import { Faq } from "@/components/sections/Faq";
import { Features } from "@/components/sections/Features";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Nav } from "@/components/sections/Nav";
import { Pricing } from "@/components/sections/Pricing";
import { WorksWith } from "@/components/sections/WorksWith";
import { YoursPrivacy } from "@/components/sections/YoursPrivacy";
import {
  CorderPresenceFormSentinel,
  CorderPresenceStaticSection,
} from "@/components/presence/CorderPresence";

export default function HomePage() {
  return (
    <main id="top">
      <Nav />
      <Hero />
      <hr className="section-divider" />
      <HowItWorks />
      <hr className="section-divider" />
      {/* Privacy block lifted out of hero + FAQ ahead of the ad test
          (2026-05-22). Reader who just saw "Record from anywhere" will
          ask "wait, who has my audio?" right here -- and this answers
          before they hit Fit / WorksWith. */}
      <YoursPrivacy />
      <hr className="section-divider" />
      <Fit />
      <hr className="section-divider" />
      <WorksWith />
      <hr className="section-divider" />
      <Features />
      <hr className="section-divider" />
      <Pricing />
      <hr className="section-divider" />
      {/* Form-zone sentinel sits BEFORE Faq so the orb (CorderPresence state B)
          morphs into the contact card (state C) while the user is still
          reading FAQ, not at the very last footer-scroll moment. Renders as
          a zero-height anchor; no visual footprint. */}
      <CorderPresenceFormSentinel />
      <Faq />
      {/* Reduced-motion / ?motion=0 fallback: when the corner morph chain
          is off, this inline section provides the same subscribe form in
          the natural page flow. Renders null when motion is enabled. */}
      <CorderPresenceStaticSection />
      <Footer />
    </main>
  );
}
