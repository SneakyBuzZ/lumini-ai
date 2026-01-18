import { getIsAuthenticated } from "@/lib/api/user-api";
import AppNavbar from "@/components/layout/app-navbar";
import AppSidebar from "@/components/layout/sidebar/app.sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const authenticated = await getIsAuthenticated();
    if (!authenticated) throw redirect({ to: "/auth" });
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <section className="w-full h-screen flex overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-0">
        <AppNavbar />
        <main className="flex-1 min-h-0 flex flex-col">
          <Outlet />
        </main>
      </div>
    </section>
  );
}
