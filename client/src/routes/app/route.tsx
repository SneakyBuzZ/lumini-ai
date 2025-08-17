import AppNavbar from "@/components/layout/app-navbar";
import AppSidebar from "@/components/layout/sidebar/app.sidebar";
import Spinner from "@/components/shared/spinner";
import { getUser } from "@/lib/data/api/user-api";
import useAuthStore from "@/lib/store/auth-store";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  beforeLoad: async () => {
    const { authenticated } = useAuthStore.getState();
    if (!authenticated) {
      throw redirect({ to: "/" });
    }

    if (location.pathname === "/app") {
      throw redirect({ to: "/app/labs" });
    }
  },
  loader: async () => {
    await getUser();
  },
  pendingComponent: () => <PendingComponent />,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="w-full h-screen overflow-clip bg-midnight-300/20 flex">
      <AppSidebar />
      <div className="flex-1 flex flex-col items-center justify-start">
        <AppNavbar />
        <Outlet />
      </div>
    </section>
  );
}

function PendingComponent() {
  return (
    <section className="h-screen w-full flex justify-center items-center bg-midnight-300">
      <Spinner /> Loading
    </section>
  );
}
