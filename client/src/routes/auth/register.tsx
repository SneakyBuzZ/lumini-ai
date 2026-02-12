import RegisterForm from "@/components/layout/forms/register-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/register")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: search.redirect as string | undefined,
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <RegisterForm />;
}
