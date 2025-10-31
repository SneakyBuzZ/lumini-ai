import HeroImage from "@/components/_home/hero-image";
import HeroSection from "@/components/_home/hero-section";
import Navbar from "@/components/layout/navbar";
import { getIsAuthenticated } from "@/lib/api/user-api";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const isAuthenticated = await getIsAuthenticated();
    if (isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <section className="w-full min-h-screen flex flex-col justify-center items-center px-10">
      <Navbar />
      <main className="min-h-screen w-full border-dashed border-x border-neutral-800 pt-28">
        <HeroSection />
        <HeroImage />
      </main>
    </section>
  );
}
