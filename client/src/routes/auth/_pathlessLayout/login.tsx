import LoginForm from "@/components/layout/forms/login-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/_pathlessLayout/login")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { redirect?: string; email?: string } => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
    email: typeof search.email === "string" ? search.email : undefined,
  }),

  component: RouteComponent,
});

function RouteComponent() {
  return <LoginForm />;
}
