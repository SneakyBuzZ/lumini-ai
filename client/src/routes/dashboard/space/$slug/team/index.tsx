import { AppTable } from "@/components/layout/table/app-table";
import { memberColumns } from "@/components/layout/table/member-columns";
import InviteMemberButton from "@/components/shared/cta-buttons/invite-member";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetWorkspaceMembers } from "@/lib/api/queries/app-queries";
import { getWorkspaceMembers } from "@/lib/api/workspace-api";
import { WorkspaceMember } from "@/lib/types/workspace-type";
import { createFileRoute } from "@tanstack/react-router";
import { CirclePlus, Search } from "lucide-react";

export const Route = createFileRoute("/dashboard/space/$slug/team/")({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["workspace-members", params.slug],
      queryFn: () => getWorkspaceMembers(params.slug),
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { data: members } = useGetWorkspaceMembers(slug);
  return (
    <div className="w-full flex flex-col justify-start items-start bg-midnight-300/70 h-full space-y-10 p-10 overflow-y-auto">
      <div className="w-full flex flex-col space-y-5">
        <h1 className="text-2xl font-semibold">Workspace Team</h1>
        <div className="flex justify-between items-center w-full">
          <div className="flex justify-start items-center bg-midnight-200 border border-neutral-800 rounded-md px-2">
            <Search className="size-4" />
            <Input
              className="bg-transparent border-none"
              placeholder="Search for a Lab"
            />
          </div>
          <InviteMemberButton>
            <Button variant={"secondary"} className="gap-1 flex items-center">
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
