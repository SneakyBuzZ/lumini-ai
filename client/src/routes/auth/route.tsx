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
    <div className="w-full h-screen flex justify-center items-center">
      <div className="z-20 w-[45%] relative flex flex-col justify-start items-center text-center gap-5 px-5 h-full bg-midnight-300 border-r border-r-neutral-900">
        <div className="absolute w-full top-0 flex h-20 justify-between items-center px-10">
          <Logo withText imgClassName="size-6" />
          <Button variant={"link"} onClick={() => navigate({ to: "/" })}>
            <ChevronLeft />
            Back
          </Button>
        </div>
        <div className="w-3/5 flex flex-col justify-center items-center text-center gap-8 h-full pt-20">
          <div className="relative w-full flex flex-col justify-center items-center gap-6">
            <Button type="submit" className="w-full" variant={"bright"}>
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
      <div className="relative flex flex-1 flex-col justify-center items-center bg-midnight-400 h-full overflow-clip">
        <h3 className="text-4xl font-bold text-white z-10">
          Welcome to <span className="text-cyan">Lumini</span>
        </h3>
        <p className="text-md text-neutral-500">
          Unlock your workspaces. Search your repos. Ship faster.
        </p>
        <img
          className="z-10 absolute -top-[15rem] right-0 rotate-[-225deg]"
          src="/assets/images/blob-left.png"
          alt="Left Blob"
        />
        <img
          className="z-10 absolute -bottom-10"
          src="/assets/vectors/stars.svg"
          alt="Left Blob"
        />
      </div>
    </div>
  );
}

function authBeforeLoad(pathname: string) {
  const { authenticated } = useAuthStore.getState();
  if (authenticated == false) {
    throw redirect({ to: "/" });
  }

  if (pathname === "/auth" || pathname === "/auth/") {
    throw redirect({ to: "/auth/login" });
  }
}
