import DemoSection from "@/components/_home/demo-section";
import FooterSection from "@/components/_home/footer-section";
import Navbar from "@/components/layout/navbar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_pathlessLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <section className="w-full min-h-screen flex flex-col justify-between items-center font-dm-sans overflow-x-clip">
        <section aria-labelledby="navbar-heading" className="w-full">
          <Navbar />
        </section>
        <main className="w-full relative min-h-screen flex flex-col justify-start items-center">
          <Outlet />
          <div className="absolute bottom-0 w-full h-[1px] border-t border-dashed border-neutral-700 z-20" />
        </main>
        <div className="relative w-full">
          <section aria-labelledby="demo-heading">
            <DemoSection />
          </section>{" "}
          <section aria-labelledby="footer-heading" className="w-full">
            <FooterSection />
          </section>
        </div>
      </section>
    </>
  );
}
