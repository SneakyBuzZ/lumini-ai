import { getIsAuthenticated } from "@/lib/api/user-api";
import AppNavbar from "@/components/layout/app-navbar";
import AppSidebar from "@/components/layout/sidebar/app.sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useGetUser } from "@/lib/api/queries/user-queries";
import { useGetWorkspaces } from "@/lib/api/queries/app-queries";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const authenticated = await getIsAuthenticated();
    if (!authenticated) {
      throw redirect({ to: "/auth" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  useGetUser();
  useGetWorkspaces();
  return (
    <section className="w-full h-screen overflow-clip flex">
      <AppSidebar />
      <div className="flex-1 flex flex-col items-center justify-start">
        <AppNavbar />
        <Outlet />
      </div>
    </section>
  );
}
