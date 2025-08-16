// import useAuthStore from "@/lib/store/auth-store";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  beforeLoad: ({ location }) => authBeforeLoad(location.pathname),
  component: AuthComponent,
});

function AuthComponent() {
  return <Outlet />;
}

function authBeforeLoad(pathname: string) {
  // const { authenticated } = useAuthStore.getState();
  // if (authenticated == false) {
  //   throw redirect({ to: "/" });
  // }

  if (pathname === "/auth" || pathname === "/auth/") {
    throw redirect({ to: "/auth/login" });
  }
}
