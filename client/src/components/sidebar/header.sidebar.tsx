import Logo from "@/components/shared/logo";
import useWorkspaceStore from "@/lib/store/workspace-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CirclePlus, Slash } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import CreateWorkspaceButton from "../cta-buttons/create-workspace";

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
          <div className="flex items-center">
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
              <SelectTrigger className="border-0 bg-transparent w-full flex justify-start ml-auto p-0 py-0">
                <div className="text-lg w-full text-white flex justify-start items-center gap-2 px-2">
                  <SelectValue placeholder="Select a workspace" />
                  <Badge variant={currentWorkspace?.plan}>
                    {currentWorkspace?.plan}
                  </Badge>
                </div>
              </SelectTrigger>
              <SelectContent className="w-[250px] overflow-auto">
                <div className="flex flex-col items-start justify-center gap-1 p-2">
                  <span className="text-sm text-neutral-400">Workspaces</span>
                  {workspaces.map((workspace) => (
                    <SelectItem
                      key={workspace.id}
                      value={workspace.id}
                      className="p-1 px-3"
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
