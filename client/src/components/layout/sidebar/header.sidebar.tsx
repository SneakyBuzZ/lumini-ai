import Logo from "@/components/shared/logo";
import useWorkspaceStore from "@/lib/store/workspace-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { CirclePlus, Slash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CreateWorkspaceButton from "@/components/shared/cta-buttons/create-workspace";

const HeaderSidebar = () => {
  const { workspaces, currentWorkspace, setCurrentWorkspace } =
    useWorkspaceStore();

  return (
    <div className="z-20 flex flex-col justify-center h-[50px]">
      {workspaces && workspaces.length > 0 ? (
        <div className="flex items-center h-full w-full px-2">
          {/* Logo and Slash: fixed, never moves */}
          <div className="flex items-center">
            <Logo imgClassName="h-5" />
            <Slash className="transform -rotate-[20deg] text-neutral-400 h-3" />
          </div>
          {/* Select: grows, but logo stays stable */}
          <div className="flex-1 flex items-center">
            <Select
              value={currentWorkspace?.id || ""}
              onValueChange={(value) => {
                const selectedWorkspace = workspaces.find(
                  (workspace) => workspace.id === value
                );
                if (selectedWorkspace) {
                  setCurrentWorkspace(selectedWorkspace);
                  localStorage.setItem(
                    "workspace",
                    JSON.stringify(selectedWorkspace)
                  );
                }
              }}
            >
              <SelectTrigger className="bg-transparent w-full flex justify-start ml-auto p-0 py-0 border-0">
                <div className="text-lg w-full text-white flex justify-start items-center gap-2 px-2">
                  {currentWorkspace && (
                    <span className="text-[16px]">{currentWorkspace.name}</span>
                  )}
                  <Badge
                    className="bg-midnight-400 border border-neutral-700 text-neutral-300 text-[10px] h-5 pointer-events-none"
                    variant={currentWorkspace?.plan}
                  >
                    {currentWorkspace?.plan || "no plan"}
                  </Badge>
                </div>
              </SelectTrigger>
              <SelectContent className="w-[300px] overflow-auto">
                <div className="flex flex-col items-start justify-center gap-1 p-2">
                  <span className="text-sm text-neutral-400 mb-1">
                    Workspaces
                  </span>
                  {workspaces.map((workspace) => (
                    <SelectItem
                      key={workspace.id}
                      value={workspace.id}
                      className="p-2 border"
                    >
                      <div className="flex items-center">{workspace.name}</div>
                    </SelectItem>
                  ))}
                </div>
                <div className="flex flex-col items-start justify-center gap-2 p-2">
                  <span className="text-sm text-neutral-400">
                    Create workspace
                  </span>
                  <CreateWorkspaceButton>
                    <Button
                      className="h-9 w-full flex justify-start items-center"
                      variant={"outline"}
                    >
                      <CirclePlus />
                      Workspace
                    </Button>
                  </CreateWorkspaceButton>
                </div>
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : (
        <Logo withText />
      )}
    </div>
  );
};

export default HeaderSidebar;
