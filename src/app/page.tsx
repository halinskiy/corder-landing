import { Comparison } from "@/components/sections/Comparison";
import { Fit } from "@/components/sections/Fit";
import { Faq } from "@/components/sections/Faq";
import { Features } from "@/components/sections/Features";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { How } from "@/components/sections/How";
import { Nav } from "@/components/sections/Nav";
import { Newsletter } from "@/components/sections/Newsletter";
import { Pricing } from "@/components/sections/Pricing";
import { WorksWith } from "@/components/sections/WorksWith";
import { WorksWithDock } from "@/components/sections/WorksWithDock";

export default function HomePage() {
  return (
    <main id="top">
      <Nav />
      <Hero />
      <hr className="section-divider" />
      <Fit />
      <hr className="section-divider" />
      <How />
      <hr className="section-divider" />
      <WorksWith />
      <hr className="section-divider" />
      <WorksWithDock />
      <hr className="section-divider" />
      <Features />
      <hr className="section-divider" />
      <Comparison />
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
