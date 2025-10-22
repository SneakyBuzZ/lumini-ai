import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/lab/$id")({
  component: LabLayout,
});

function LabLayout() {
  return (
    <div className="flex-1 h-full flex flex-col items-center justify-start min-h-0">
      <Outlet />
    </div>
  );
}
