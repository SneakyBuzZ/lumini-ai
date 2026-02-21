import Loading from "@/components/shared/loading";
import Logo from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { getIsAuthenticated } from "@/lib/api/user-api";
import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/auth")({
  loader: async ({ location }) => {
    if (location.pathname.includes("/auth/verify")) return;
    const authenticated = await getIsAuthenticated();
    if (authenticated == true) {
      throw redirect({ to: "/dashboard" });
    }
    if (location.pathname === "/auth" || location.pathname === "/auth/") {
      throw redirect({ to: "/auth/login" });
    }
  },
  pendingComponent: Loading,
  component: AuthComponent,
});

function AuthComponent() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex justify-center items-center bg-midnight-400">
      <div className="w-[100%] sm:w-[75%] lg:w-[45%] h-full relative flex flex-col justify-start items-center border-dashed border-x border-neutral-700">
        <div className="absolute w-full top-0 flex h-20 justify-between items-center px-8 sm:px-10 border-dashed border-b border-neutral-700 bg-midnight-400">
          <Logo withText imgClassName="size-6" />
          <Button variant={"link"} onClick={() => navigate({ to: "/" })}>
            <ChevronLeft />
            Back
          </Button>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
