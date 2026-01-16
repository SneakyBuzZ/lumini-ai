import Spinner from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { useAcceptInvite } from "@/lib/api/mutations/app-mutations";
import { UseNavigateResult } from "@tanstack/react-router";
import { useState } from "react";

interface ActionBlockProps {
  workspace: string;
  token: string;
  navigate: UseNavigateResult<"/invite">;
}

export default function ActionBlock({
  workspace,
  token,
  navigate,
}: ActionBlockProps) {
  const [error, setError] = useState("");
  const { mutateAsync: acceptInvite, isPending } = useAcceptInvite(setError);

  const handleAccept = async () => {
    const workspaceId = await acceptInvite(token);
    navigate({ to: "/dashboard/space/$id", params: { id: workspaceId } });
  };

  return (
    <>
      <div className="bg-midnight-200/50 flex flex-col justify-center items-center max-w-lg text-center py-4">
        <p className="text-sm p-2 px-6">
          You have been invited to join the workspace{" "}
          <span className="font-bold">{workspace}</span>. Click the button below
          to accept the invitation and join the team.
        </p>
        {error === "" ? (
          <div className="w-full flex justify-center items-center gap-2 p-2">
            <Button variant={"secondary"} onClick={handleAccept}>
              {isPending ? (
                <>
                  <Spinner />
                  Accepting
                </>
              ) : (
                "Accept"
              )}
            </Button>
            <Button className="bg-midnight-100 hover:bg-midnight-100/80">
              Decline
            </Button>
          </div>
        ) : (
          <div className="w-full flex justify-center items-center gap-2 p-2">
            <span className="text-red-400">{error}</span>
          </div>
        )}
      </div>
      <div className="w-full border-t border-neutral-800">
        <p className="text-xs text-neutral-500 p-4 px-4 text-center">
          You can check your invitations in your account settings.
        </p>
      </div>
    </>
  );
}
