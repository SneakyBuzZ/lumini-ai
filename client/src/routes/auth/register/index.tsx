import RegisterForm from "@/components/layout/forms/register-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/register/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <RegisterForm />
      <div className="flex flex-1">LOGIN</div>
    </div>
  );
}
