import LabCard from "@/components/_lab/lab-card";
import { labColumns } from "@/components/layout/table/lab-columns";
import { AppTable } from "@/components/layout/table/app-table";
import CreateLabButton from "@/components/shared/cta-buttons/create-lab";
import CreateWorkspaceButton from "@/components/shared/cta-buttons/create-workspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lab } from "@/lib/types/lab.type";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { CirclePlus, Search } from "lucide-react";
import { getAllWorkspaces } from "@/lib/api/workspace-api";
import { getAllLabs } from "@/lib/api/lab-api";
import Spinner from "@/components/shared/spinner";
import useAppStore from "@/lib/store/project-store";
import { useEffect } from "react";
import { delay } from "@/utils/delay.util";

export const Route = createFileRoute("/dashboard/")({
  loader: async () => {
    await delay(1000);
    const workspaces = await getAllWorkspaces();
    const labs = await getAllLabs(workspaces[0].id);
    return { workspaces, labs };
  },
  pendingComponent: PendingComponent,
  component: RouteComponent,
});

function RouteComponent() {
  const { labs, workspaces } = Route.useLoaderData();
  const { setLabs, setWorkspaces, setCurrentWorkspace } = useAppStore();

  useEffect(() => {
    setLabs(labs);
    setWorkspaces(workspaces);
    setCurrentWorkspace(workspaces[0]);
  }, [labs, workspaces, setLabs, setWorkspaces, setCurrentWorkspace]);

  return (
    <main className="w-full flex flex-col justify-start items-center bg-midnight-300/70 h-full space-y-8 p-10 overflow-y-auto">
      <div className="space-y-5 w-full border-b pb-8">
        <div className="space-y-1 w-full">
          <h3 className="text-xl font-space tracking-tight text-neutral-300 font-semibold">
            Recent Labs
          </h3>
          <p className="text-md text-neutral-500">
            Explore your recent Labs and get back to where you left off.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <LabCard />
          <LabCard />
          <LabCard />
        </div>
      </div>
      {/* <div className="space-y-5 w-full border-b pb-8">
        <div className="space-y-1 w-full">
          <h3 className="text-xl font-space tracking-tight text-neutral-300  font-semibold">
            Starred Labs
          </h3>
          <p className="text-md text-neutral-500">
            These are the Labs you’ve starred for quick access.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <LabCard />
          <LabCard />
        </div>
      </div> */}
      <div className="space-y-5 w-full">
        <div className="space-y-1 w-full">
          <h3 className="text-xl font-space tracking-tight text-neutral-300  font-semibold">
            Starred Labs
          </h3>
          <p className="text-md text-neutral-500">
            These are the Labs you’ve starred for quick access.
          </p>
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="flex justify-start items-center gap-3">
            <CreateLabButton>
              <Button className="gap-1 flex items-center">
                <CirclePlus />
                Lab
              </Button>
            </CreateLabButton>

            <CreateWorkspaceButton>
              <Button variant={"secondary"} className="gap-1 flex items-center">
                <CirclePlus />
                Workspace
              </Button>
            </CreateWorkspaceButton>
          </div>
          <div className="flex justify-start items-center bg-midnight-200 border border-neutral-800 rounded-md px-2">
            <Search className="size-4" />
            <Input
              className="bg-transparent border-none"
              placeholder="Search for a Lab"
            />
          </div>
        </div>
        {labs && labs.length > 0 ? (
          <AppTable<Lab> columns={labColumns} data={labs} />
        ) : (
          <div className="flex flex-col justify-center items-center w-full border border-dashed border-neutral-800 gap-3 py-10 rounded-lg bg-midnight-100/30">
            <div className="flex flex-col justify-center items-center">
              <span className="text-neutral-200 text-xl font-semibold">
                No Labs
              </span>
              <span className="text-neutral-500">
                Get started by creating one
              </span>
            </div>
            <Button>Get started</Button>
            <p className="text-xs text-center text-neutral-500 w-1/3 mt-3">
              Dive into your personal workspace where each Lab connects to a
              GitHub repo and helps you illuminate what matters.
            </p>
          </div>
        )}
      </div>
      <Outlet />
    </main>
  );
}

function PendingComponent() {
  return (
    <div className="absolute top-0 flex items-center justify-center h-screen w-full">
      <Spinner />
      <span className="text-neutral-500">Loading</span>
    </div>
  );
}
