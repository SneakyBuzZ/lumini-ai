import AppSidebar from "@/components/layout/sidebar/app.sidebar";
import useAuthStore from "@/lib/store/auth-store";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  beforeLoad: async () => {
    const { authenticated } = useAuthStore.getState();
    if (!authenticated) {
      throw redirect({ to: "/" });
    }

    if (location.pathname === "/app") {
      throw redirect({ to: "/app/labs/$id/canvas", params: { id: "12" } });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="w-full h-screen overflow-clip bg-midnight-300/50 flex">
      <AppSidebar />
      <Outlet />
    </section>
  );
}
