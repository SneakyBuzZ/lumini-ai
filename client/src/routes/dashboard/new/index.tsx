import WorkspaceForm from "@/components/layout/forms/workspace-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/new/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center px-8">
      <div className="space-y-4 max-w-sm sm:max-w-xl bg-midnight-300 rounded-lg border border-midnight-100 lg:-translate-y-8">
        <div className="flex flex-col p-2 sm:p-4 sm:py-3 px-4 border-b border-midnight-100">
          <h1 className="text-md md:text-lg tracking-tight font-semibold text-neutral-200">
            Create a new workspace
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-neutral-500 px-4">
          Workspaces are your personal space to create and experiment with your
          code. Each workspace has its own labs and settings.
        </p>
        <WorkspaceForm />
      </div>
    </div>
  );
}
