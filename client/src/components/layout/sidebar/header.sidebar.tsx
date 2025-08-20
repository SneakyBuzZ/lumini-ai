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
import useAppStore from "@/lib/store/project-store";

const HeaderSidebar = () => {
  const { workspaces, currentWorkspace, setCurrentWorkspace } = useAppStore();

  return (
    <div className="z-20 flex flex-col justify-center h-[46px] px-3">
      {workspaces && workspaces.length > 0 ? (
        <div className="flex items-center h-full w-full px-2">
          <div className="flex items-center">
            <Logo imgClassName="h-5" />
            <Slash className="transform -rotate-[20deg] text-neutral-400 h-3" />
          </div>
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
              <SelectTrigger className="w-full flex justify-start border-none bg-transparent">
                <div className="text-lg w-full text-white flex justify-start items-center gap-2 px-2">
                  {currentWorkspace && (
                    <span className="text-[14px]">{currentWorkspace.name}</span>
                  )}
                  <Badge
                    className="bg-midnight-100 border border-neutral-800 rounded-ful text-neutral-300 text-[10px] h-5 pointer-events-none"
                    variant={currentWorkspace?.plan}
                  >
                    {currentWorkspace?.plan || "no plan"}
                  </Badge>
                </div>
              </SelectTrigger>
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
                  {workspaces.map((workspace) => (
                    <SelectItem
                      key={workspace.id}
                      value={workspace.id}
                      className="bg-none text-neutral-400 focus:text-white"
                    >
                      {workspace.name}
                    </SelectItem>
                  ))}
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
