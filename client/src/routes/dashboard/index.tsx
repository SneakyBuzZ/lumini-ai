import { getUser } from "@/lib/api/user-api";
import { getAllWorkspaces } from "@/lib/api/workspace-api";
import { Workspace } from "@/lib/types/workspace-type";
import { loadRecentWorkspaceId } from "@/utils/local-storage";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  loader: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData({
      queryKey: ["user"],
      queryFn: getUser,
    });

    if (!user) {
      throw redirect({ to: "/auth/login" });
    }

    const workspaces = await context.queryClient.ensureQueryData<Workspace[]>({
      queryKey: ["workspaces"],
      queryFn: getAllWorkspaces,
    });

    if (!workspaces || workspaces.length === 0) {
      throw redirect({ to: "/auth/login" });
    }

    const recentWorkspaceId = loadRecentWorkspaceId();
    const workspace =
      workspaces.find((w) => w.id === recentWorkspaceId) ?? workspaces[0];

    throw redirect({
      to: "/dashboard/space/$slug",
      params: { slug: workspace.slug },
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return null;
}
