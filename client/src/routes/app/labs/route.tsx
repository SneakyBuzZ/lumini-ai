import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app/labs")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1>Hello "/app/labs"!</h1>
      <Outlet />
    </div>
  );
}
