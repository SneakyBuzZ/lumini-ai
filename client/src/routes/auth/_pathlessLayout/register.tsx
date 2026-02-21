import RegisterForm from "@/components/layout/forms/register-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/_pathlessLayout/register")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { token?: string; workspace?: string } => ({
    token: typeof search.token === "string" ? search.token : undefined,
    workspace:
      typeof search.workspace === "string" ? search.workspace : undefined,
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <RegisterForm />;
}
