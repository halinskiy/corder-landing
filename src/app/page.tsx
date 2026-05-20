import { Fit } from "@/components/sections/Fit";
import { Faq } from "@/components/sections/Faq";
import { Features } from "@/components/sections/Features";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Nav } from "@/components/sections/Nav";
import { Pricing } from "@/components/sections/Pricing";
import { WorksWith } from "@/components/sections/WorksWith";
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
      <Fit />
      <hr className="section-divider" />
      <WorksWith />
      <hr className="section-divider" />
      <Features />
      <hr className="section-divider" />
      <Pricing />
      <hr className="section-divider" />
      <Faq />
      {/* Form-zone sentinel sits where the old Newsletter section used to.
          The orb (CorderPresence state B) morphs into a contact card
          (state C) as this sentinel scrolls into the upper 40% of the
          viewport. Renders as a zero-height anchor; no visual footprint. */}
      <CorderPresenceFormSentinel />
      {/* Reduced-motion / ?motion=0 fallback: when the corner morph chain
          is off, this inline section provides the same subscribe form in
          the natural page flow. Renders null when motion is enabled. */}
      <CorderPresenceStaticSection />
      <Footer />
    </main>
  );
}
