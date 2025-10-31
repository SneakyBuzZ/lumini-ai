// import useAuthStore from "@/lib/store/auth-store";
import Logo from "@/components/shared/logo";
import OrElement from "@/components/shared/or-element";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/lib/store/auth-store";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { SiGithub } from "react-icons/si";

export const Route = createFileRoute("/auth")({
  beforeLoad: ({ location }) => authBeforeLoad(location.pathname),
  component: AuthComponent,
});

function AuthComponent() {
  const navigate = useNavigate();
  const {
    location: { pathname },
  } = useRouterState();
  return (
    <div className="w-full h-screen flex justify-center items-center bg-midnight-400">
      <div className="w-[45%] h-full relative flex flex-col justify-start items-center border-dashed border-x border-neutral-800">
        <div className="absolute w-full top-0 flex h-20 justify-between items-center px-10 border-dashed border-b border-neutral-800 bg-midnight-400">
          <Logo withText imgClassName="size-6" />
          <Button variant={"link"} onClick={() => navigate({ to: "/" })}>
            <ChevronLeft />
            Back
          </Button>
        </div>
        <div className="w-3/5 flex flex-col justify-center items-center text-center gap-8 h-full pt-20">
          <div className="relative w-full flex flex-col justify-center items-center gap-6">
            <Button
              type="submit"
              className="w-full bg-midnight-100 hover:bg-midnight-200"
              variant={"outline"}
            >
              <SiGithub />
              Continue with Github
            </Button>
          </div>
          <OrElement />
          <Outlet />
          <span>
            Don't have an account?{" "}
            <Link
              to={pathname === "/auth/login" ? "/auth/register" : "/auth/login"}
              className="text-teal"
            >
              {pathname === "/auth/login" ? "Register" : "Login"}
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

function authBeforeLoad(pathname: string) {
  const { authenticated } = useAuthStore.getState();
  if (authenticated == true) {
    throw redirect({ to: "/" });
  }

  if (pathname === "/auth" || pathname === "/auth/") {
    throw redirect({ to: "/auth/login" });
  }
}
