import AboutSection from "@/components/_home/about-section";
import DemoSection from "@/components/_home/demo-section";
import FeatureSection from "@/components/_home/feature-section";
import FooterSection from "@/components/_home/footer-section";
import HeroSection from "@/components/_home/hero-section";
import TestimonySection from "@/components/_home/testimony-section";
import Navbar from "@/components/layout/navbar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <>
      <Navbar />

      <main className="w-full min-h-screen flex flex-col justify-center items-center">
        <div className="min-h-screen w-full">
          {/* HERO */}
          <section aria-labelledby="hero-heading" className="w-full relative">
            <HeroSection />
          </section>

          {/* ABOUT */}
          <section aria-labelledby="about-heading" className="w-full relative">
            <AboutSection />
          </section>
        </div>

        {/* TESTIMONY */}
        <section
          aria-labelledby="testimony-heading"
          className="w-full relative"
        >
          <TestimonySection />
        </section>

        <div className="relative w-full">
          <section aria-labelledby="feature-heading">
            <FeatureSection />
          </section>
          <section aria-labelledby="demo-heading">
            <DemoSection />
          </section>
        </div>
        <div className="relative w-full">
          <section aria-labelledby="footer-heading">
            <FooterSection />
          </section>
        </div>
      </main>
    </>
  );
}
