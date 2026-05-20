import { Fit } from "@/components/sections/Fit";
import { Faq } from "@/components/sections/Faq";
import { Features } from "@/components/sections/Features";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Nav } from "@/components/sections/Nav";
import { Newsletter } from "@/components/sections/Newsletter";
import { Pricing } from "@/components/sections/Pricing";
import { WorksWith } from "@/components/sections/WorksWith";

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
      <hr className="section-divider" />
      <Newsletter />
      <hr className="section-divider" />
      <Footer />
    </main>
  );
}
