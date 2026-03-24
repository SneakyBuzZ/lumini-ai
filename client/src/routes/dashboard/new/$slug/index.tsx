import LabForm from "@/components/layout/forms/lab-form";
import { getAllWorkspaces } from "@/lib/api/workspace-api";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/new/$slug/")({
  loader: async ({ context }) => {
    const workspaces = await context.queryClient.ensureQueryData({
      queryKey: ["workspaces"],
      queryFn: () =>
        context.queryClient.ensureQueryData({
          queryKey: ["workspaces"],
          queryFn: () => getAllWorkspaces(),
        }),
    });
    return { data: workspaces };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { data: workspaces } = Route.useLoaderData();
  return (
    <div className="w-full h-full flex flex-col justify-center items-center px-8">
      <div className="space-y-4 max-w-sm sm:max-w-xl bg-midnight-300 rounded-lg border border-midnight-100 lg:-translate-y-8">
        <div className="flex flex-col p-2 sm:p-4 sm:py-3 px-4 border-b border-midnight-100">
          <h1 className="text-md md:text-lg tracking-tight font-semibold text-neutral-200">
            Create a new lab
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-neutral-500 px-4">
          Labs are your personal space to create and experiment with your code.
          Each lab has its own settings and dependencies.
        </p>
        <LabForm slug={slug} workspaces={workspaces} />
      </div>
    </div>
  );
}
