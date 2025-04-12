import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetAllWorkspaces } from "@/lib/data/queries/workspace.query";
import { CirclePlus, Search } from "lucide-react";

const WorkspacePage = () => {
  const { data: workspaces } = useGetAllWorkspaces();

  return (
    <div className="flex flex-1 justify-center items-start bg-midnight-300">
      <div className="space-y-5 w-11/12 py-10">
        <div className="space-y-1 w-full">
          <h3 className="text-3xl font-semibold font-space tracking-tight">
            Your Workspaces
          </h3>
          <p className="text-md text-neutral-500">
            Workspaces are your personal space to create and experiment with
            your code. Each workspace has its own labs and settings.
          </p>
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="flex justify-start items-center gap-3">
            <Button className="gap-1 flex items-center">
              <CirclePlus />
              Workspace
            </Button>
            <Button variant={"secondary"} className="gap-1 flex items-center">
              <CirclePlus />
              Lab
            </Button>
          </div>
          <div className="flex justify-start items-center bg-midnight-200 border border-neutral-800 rounded-md px-2">
            <Search className="size-4" />
            <Input
              className="bg-transparent border-none"
              placeholder="Search for a Lab"
            />
          </div>
        </div>
        {workspaces && workspaces.length > 0 ? (
          <>
            {workspaces.map((workspace) => (
              <Button
                variant={"outline"}
                className="p-2 py-4 flex bg-midnight-300 justify-start items-center gap-5 border border-neutral-900"
                key={workspace.id}
              >
                <span>{workspace.name}</span>
                <span>{workspace.plan}</span>
                <span>{workspace.createdAt}</span>
              </Button>
            ))}
          </>
        ) : (
          <>
            {" "}
            <div className="flex flex-col justify-center items-center w-full border border-dashed border-neutral-800 gap-3 py-10 rounded-lg bg-midnight-100/30">
              <div className="flex flex-col justify-center items-center">
                <span className="text-neutral-200 text-xl font-semibold">
                  No Workspace
                </span>
                <span className="text-neutral-500">
                  Get started by creating one
                </span>
              </div>
              <Button>Get started</Button>
              <p className="text-xs text-center text-neutral-500 w-1/3 mt-3">
                By creating a workspace, you agree to our Terms of Service and
                Privacy Policy
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkspacePage;
