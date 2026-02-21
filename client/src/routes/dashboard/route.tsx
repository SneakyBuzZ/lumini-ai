import { getIsAuthenticated, getUser } from "@/lib/api/user-api";
import AppSidebar from "@/components/layout/sidebar/app.sidebar";
import {
  createFileRoute,
  Outlet,
  redirect,
  useLocation,
} from "@tanstack/react-router";
import Loading from "@/components/shared/loading";
import AppNavbar from "@/components/layout/app-navbar/index";
import { getAllWorkspaces } from "@/lib/api/workspace-api";

export const Route = createFileRoute("/dashboard")({
  loader: async ({ context }) => {
    const authenticated = await getIsAuthenticated();
    if (authenticated == false) {
      throw redirect({ to: "/auth/login" });
    }
    const user = await getUser();
    if (!user) {
      throw redirect({ to: "/auth/login" });
    }
    if (user.isVerified === null) {
      throw redirect({ to: "/auth/verify" });
    }

    const workspaces = await context.queryClient.ensureQueryData({
      queryKey: ["workspaces"],
      queryFn: getAllWorkspaces,
    });

    return { data: { user, workspaces } };
  },
  pendingComponent: Loading,
  component: DashboardLayout,
});

function DashboardLayout() {
  const { data } = Route.useLoaderData();
  const { pathname } = useLocation();

  return (
    <section className="w-full h-screen flex flex-col overflow-hidden bg-midnight-400">
      <AppNavbar user={data.user} workspaces={data.workspaces} />

      <main className="flex flex-1 overflow-hidden">
        {pathname !== "/dashboard/new" && <AppSidebar />}

        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </section>
  );
}
