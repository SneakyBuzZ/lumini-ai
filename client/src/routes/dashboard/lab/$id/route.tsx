import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/lab/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-full w-full flex flex-col justify-start items-center">
      <Outlet />
    </div>
  );
}
