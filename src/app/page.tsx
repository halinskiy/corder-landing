import { Fit } from "@/components/sections/Fit";
import { Faq } from "@/components/sections/Faq";
import { Features } from "@/components/sections/Features";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { How } from "@/components/sections/How";
import { Nav } from "@/components/sections/Nav";
import { Pricing } from "@/components/sections/Pricing";
import { Privacy } from "@/components/sections/Privacy";

export default function HomePage() {
  return (
    <main id="top">
      <Nav />
      <Hero />
      <hr className="section-divider" />
      <Privacy />
      <hr className="section-divider" />
      <How />
      <hr className="section-divider" />
      <Features />
      <hr className="section-divider" />
      <Fit />
      <hr className="section-divider" />
      <Pricing />
      <hr className="section-divider" />
      <Faq />
      <FinalCta />
      <hr className="section-divider" />
      <Footer />
    </main>
  );
}
