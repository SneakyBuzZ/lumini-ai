import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  loader: () => {
    throw redirect({ to: "/dashboard/space" });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return null;
}
