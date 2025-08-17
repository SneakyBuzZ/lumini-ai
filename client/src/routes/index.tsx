import BgImages from "@/components/_home/bg-images";
import HeroSection from "@/components/_home/hero-section";
import Navbar from "@/components/layout/navbar";
import { getIsAuthenticated } from "@/lib/data/api/user-api";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const isAuthenticated = await getIsAuthenticated();
    if (isAuthenticated) {
      throw redirect({ to: "/app" });
    }
  },
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <>
      <div className="w-full flex flex-col min-h-screen relative justify-center items-center overflow-x-clip">
        <Navbar />
        <img
          className="absolute h-[40rem] w-[40rem] -left-20 bottom-0 z-10"
          src="/assets/images/blob-left.png"
          alt="Left Blob"
        />
        <img
          className="absolute h-[40rem] w-[30rem] -right-10 -top-40 z-10"
          src="/assets/images/blob-right.png"
          alt="Right Blob"
        />
        <div className="z-20 w-full h-screen flex flex-col justify-center items-center backdrop-blur-2xl relative bg-midnight-400/20 overflow-clip">
          <HeroSection />
          <BgImages />
        </div>
      </div>
    </>
  );
}
