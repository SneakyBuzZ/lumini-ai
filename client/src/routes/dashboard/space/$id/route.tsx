import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/space/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
