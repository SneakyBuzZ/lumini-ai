import { GreetEmail, GreetToken } from "@/components/_auth/greet-verification";
import VerifyButtons from "@/components/_auth/verify-buttons";
import Loading from "@/components/shared/loading";
import { getUser } from "@/lib/api/user-api";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Check } from "lucide-react";

export const Route = createFileRoute("/auth/verify")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { email?: string; token?: string } => ({
    email: typeof search.email === "string" ? search.email : undefined,
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  loader: async () => {
    const user = await getUser();
    if (!user) {
      throw redirect({ to: "/auth/login" });
    }
    if (user.isVerified !== null) {
      throw redirect({ to: "/dashboard/new" });
    }
  },
  pendingComponent: Loading,
  component: RouteComponent,
});

function RouteComponent() {
  const { email, token } = Route.useSearch();

  if (token) {
    return (
      <div className="w-full flex flex-col justify-center items-center pt-20 h-full mb-20">
        <GreetToken token={token} />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col justify-between items-center pt-20 pb-20 h-full">
      <GreetEmail email={email ?? ""} />
      <VerifyButtons email={email ?? ""} />
      <UnlockFeatures />
    </div>
  );
}

function UnlockFeatures() {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-2 border-b border-dashed border-neutral-700 py-14">
      <h2 className="text-xl text-neutral-300 font-semibold">
        You’ll unlock all of Lumini’s features:
      </h2>
      <ul className="flex flex-col justify-center items-start gap-2 max-w-lg">
        <li className="flex items-center gap-2 text-neutral-500">
          <Check className="h-4 w-4 text-cyan" />
          Workspaces to collaborate with your team
        </li>
        <li className="flex items-center gap-2 text-neutral-500">
          <Check className="h-4 w-4 text-cyan" />
          Labs to analyze github repos and get insights
        </li>
        <li className="flex items-center gap-2 text-neutral-500">
          <Check className="h-4 w-4 text-cyan" />
          Get experience BYOK integrations for work
        </li>
      </ul>
    </div>
  );
}
