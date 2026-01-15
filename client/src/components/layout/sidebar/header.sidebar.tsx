import Logo from "@/components/shared/logo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { CirclePlus, Search, Slash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CreateWorkspaceButton from "@/components/shared/cta-buttons/create-workspace";
import { Input } from "@/components/ui/input";
import { useGetWorkspaces } from "@/lib/api/queries/app-queries";
import { useLocation } from "@tanstack/react-router";
import { Workspace } from "@/lib/types/workspace-type";

const HeaderSidebar = () => {
  const { pathname } = useLocation();

  const { data: workspaces } = useGetWorkspaces();
  if (!workspaces) return null;

  const currentWorkspaceId = pathname.split("/")[3];
  const currentWorkspace = workspaces.find(
    (ws) => ws.id === currentWorkspaceId
  );
  return (
    <div className="z-20 flex flex-col justify-center h-[50px] px-3">
      {workspaces && workspaces.length > 0 ? (
        <div className="flex items-center h-full w-full p-2">
          <div className="flex items-center">
            <Logo imgClassName="h-5" />
            <Slash className="transform -rotate-[20deg] text-neutral-400 h-3" />
          </div>
          <div className="flex-1 flex items-center">
            <Select
              value={currentWorkspaceId || ""}
              onValueChange={(value) => onSelectValueChange(value, workspaces)}
            >
              {currentWorkspace && (
                <WorkspaceSelectTrigger currentWorkspace={currentWorkspace} />
              )}
              <WorkspaceSelectContent workspaces={workspaces} />
            </Select>
          </div>
        </div>
      ) : (
        <Logo withText />
      )}
    </div>
  );
};

const onSelectValueChange = (value: string, workspaces: Workspace[]) => {
  const selectedWorkspace = workspaces.find(
    (workspace) => workspace.id === value
  );
  console.log(selectedWorkspace);
  // if (selectedWorkspace) {
  // navigate({
  //   to: `/dashboard/space/${selectedWorkspace.id}/${segments[size - 1]}`,
  // });
  // }
};

function WorkspaceSelectContent({ workspaces }: { workspaces: Workspace[] }) {
  return (
    <SelectContent
      align="start"
      className="w-[300px] flex flex-col justify-start items-start gap-4 bg-midnight-200/80 backdrop-blur-md shadow-xl shadow-black"
    >
      <div className="flex items-center justify-between w-full px-2 h-10">
        <Search className="h-4 w-4" />
        <Input
          className="flex-1 border-none bg-none"
          placeholder="Search workspaces..."
        />
      </div>
      <ul className="flex flex-col items-start justify-center gap-1 border-y py-2">
        <WorkspaceList workspaces={workspaces} />
      </ul>
      <div className="p-1">
        <CreateWorkspaceButton>
          <Button
            variant={"outline"}
            className="h-8 w-full flex justify-start items-center bg-midnight-100"
          >
            <CirclePlus className="h-4" />
            Create Workspace
          </Button>
        </CreateWorkspaceButton>
      </div>
    </SelectContent>
  );
}

function WorkspaceSelectTrigger({
  currentWorkspace,
}: {
  currentWorkspace: Workspace;
}) {
  return (
    <SelectTrigger className="w-full flex border-none justify-start bg-transparent">
      <div className="text-lg w-full text-white flex justify-start items-center gap-2 px-2">
        <span className="text-[14px]">{currentWorkspace.name}</span>
        <Badge
          className="bg-midnight-100 border border-neutral-800 rounded-ful text-neutral-300 text-[10px] h-5 pointer-events-none"
          variant={currentWorkspace?.plan}
        >
          {currentWorkspace?.plan || "no plan"}
        </Badge>
      </div>
    </SelectTrigger>
  );
}

function WorkspaceList({ workspaces }: { workspaces: Workspace[] }) {
  if (!workspaces || workspaces.length === 0) return null;
  return (
    <>
      {workspaces.map((workspace) => (
        <SelectItem
          key={workspace.id}
          value={workspace.id}
          className="bg-none text-neutral-400 focus:text-white"
        >
          {workspace.name}
        </SelectItem>
      ))}
    </>
  );
}

export default HeaderSidebar;
