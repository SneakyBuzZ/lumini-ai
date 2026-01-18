import ActionBlock from "@/components/_workspace/invite/action-block";
import RedirectBlock from "@/components/_workspace/invite/redirect-block";
import Logo from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { getIsAuthenticated } from "@/lib/api/user-api";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/invite/")({
  loader: async () => {
    const isAuthenticated = await getIsAuthenticated();
    return isAuthenticated;
  },
  component: RouteComponent,
  validateSearch: (
    search: Record<string, unknown>
  ): { workspace: string; token: string } => ({
    workspace: (search.workspace as string) || "",
    token: (search.token as string) || "",
  }),
});

function RouteComponent() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const userExists = Route.useLoaderData();

  const handleRedirect = (isLogin: boolean) => {
    const path = isLogin ? "/auth/login" : "/auth/register";
    navigate({
      to: path,
      search: {
        redirect: window.location.pathname + window.location.search,
      },
    });
  };

  return (
    <main className="relative w-1/2 h-screen flex flex-col justify-center items-center border-x border-dashed border-neutral-800">
      <div className="absolute w-full top-0 flex h-20 justify-between items-center px-10 border-dashed border-b border-neutral-800 bg-midnight-400">
        <Logo withText imgClassName="size-6" />
        <Button variant={"link"} onClick={() => navigate({ to: "/" })}>
          <ChevronLeft />
          Back
        </Button>
      </div>
      <div className="w-[25rem] bg-midnight-300 border border-neutral-800 rounded-md flex flex-col justify-center items-center">
        <h3 className="w-full text-center text-xl font-semibold text-neutral-300 border-b p-2.5">
          Invitation to join{" "}
          <span className="text-cyan/70">{search.workspace}</span>
        </h3>
        {userExists ? (
          <ActionBlock
            workspace={search.workspace}
            token={search.token}
            navigate={navigate}
          />
        ) : (
          <RedirectBlock
            workspace={search.workspace}
            handleRedirect={handleRedirect}
          />
        )}
      </div>
    </main>
  );
}
