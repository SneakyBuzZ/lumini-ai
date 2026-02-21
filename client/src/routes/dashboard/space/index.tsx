import { getAllWorkspaces } from "@/lib/api/workspace-api";
import { loadRecentWorkspaceId } from "@/utils/local-storage";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/space/")({
  loader: async ({ context }) => {
    const workspaces = await context.queryClient.ensureQueryData({
      queryKey: ["workspaces"],
      queryFn: getAllWorkspaces,
    });

    if (!workspaces || workspaces.length === 0) {
      throw redirect({ to: "/dashboard/new" });
    }

    const recentWorkspaceId = loadRecentWorkspaceId();
    const workspace = workspaces.find((ws) => ws.id === recentWorkspaceId);

    throw redirect({
      to: "/dashboard/space/$slug",
      params: { slug: workspace ? workspace.slug : workspaces[0].slug },
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return null;
}
