import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/space/$id/billing/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dashboard/space/$id/billing/"!</div>;
}
