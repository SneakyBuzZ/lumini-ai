import OrElement from "@/components/shared/or-element";
import { Button } from "@/components/ui/button";
import {
  createFileRoute,
  Link,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { SiGithub } from "react-icons/si";

export const Route = createFileRoute("/auth/_pathlessLayout")({
  component: AuthComponent,
});

function AuthComponent() {
  const {
    location: { pathname },
  } = useRouterState();
  return (
    <div className="w-full h-screen flex justify-center items-center bg-midnight-400">
      <div className="w-full xl:w-4/5 flex flex-col justify-center items-center text-center gap-8 h-full pt-20 px-10 md:px-16 lg:px-16 xl:px-20">
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
  );
}
