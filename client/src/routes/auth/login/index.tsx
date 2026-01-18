import LoginForm from "@/components/layout/forms/login-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/login/")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: search.redirect as string | undefined,
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <LoginForm />;
}
