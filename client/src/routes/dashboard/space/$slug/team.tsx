import { AppTable } from "@/components/layout/table/app-table";
import { memberColumns } from "@/components/layout/table/member-columns";
import InviteMemberButton from "@/components/shared/cta-buttons/invite-member";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getWorkspaceMembers } from "@/lib/api/workspace-api";
import { WorkspaceMember } from "@/lib/types/workspace-type";
import { createFileRoute } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { CirclePlus, Search } from "lucide-react";

export const Route = createFileRoute("/dashboard/space/$slug/team")({
  loader: async ({ context, params }) => {
    try {
      const members = await context.queryClient.ensureQueryData({
        queryKey: ["workspace-members", params.slug],
        queryFn: () => getWorkspaceMembers(params.slug),
      });
      return { data: members };
    } catch (error) {
      if (error instanceof AxiosError)
        console.log(
          "Error fetching workspace members:",
          error.response?.data || error.message,
        );
      return { data: [] };
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data: members } = Route.useLoaderData();
  return (
    <div className="w-full flex flex-col justify-start items-start bg-midnight-300/70 h-full space-y-6 p-10 px-20 overflow-y-auto">
      <h3 className="text-2xl font-space tracking-tight text-neutral-300 font-semibold">
        Team
      </h3>
      <div className="w-full space-y-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex justify-start items-center bg-midnight-200 border border-neutral-800 rounded-lg px-2">
            <Search className="size-4" />
            <Input
              className="bg-transparent border-0 focus-visible:bg-transparent focus-visible:ring-transparent"
              placeholder="Search for a member"
            />
          </div>
          <InviteMemberButton>
            <Button
              variant={"secondary"}
              className="gap-2 flex items-center px-4"
            >
              <CirclePlus />
              Invite Member
            </Button>
          </InviteMemberButton>
        </div>
        <AppTable<WorkspaceMember> columns={memberColumns} data={members} />
      </div>
    </div>
  );
}
