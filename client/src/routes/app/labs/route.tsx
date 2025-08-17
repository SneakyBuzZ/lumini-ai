import LabCard from "@/components/_lab/lab-card";
import { labColumns } from "@/components/layout/table/lab-columns";
import { WorkspaceTable } from "@/components/layout/table/workspace.table";
import CreateLabButton from "@/components/shared/cta-buttons/create-lab";
import CreateWorkspaceButton from "@/components/shared/cta-buttons/create-workspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LabWithMembers } from "@/lib/types/lab.type";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { CirclePlus, Search } from "lucide-react";

export const Route = createFileRoute("/app/labs")({
  component: RouteComponent,
});

function RouteComponent() {
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
        {workspaceLabs && workspaceLabs.length > 0 ? (
          <WorkspaceTable<LabWithMembers>
            columns={labColumns}
            data={workspaceLabs}
          />
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

const workspaceLabs: LabWithMembers[] = [
  {
    id: "1",
    name: "Lab 1",
    githubUrl: "https://github.com/user/lab1",
    creator: {
      name: "User 1",
      image:
        "https://i.pinimg.com/736x/2f/80/75/2f8075995dd1da536aa137d6645d7d02.jpg",
    },
    workspace: {
      id: "workspace-1",
      name: "Workspace 1",
    },
    createdAt: "2023-01-01",
  },
  {
    id: "2",
    name: "Lab 2",
    githubUrl: "https://github.com/user/lab2",
    creator: {
      name: "User 2",
      image:
        "https://i.pinimg.com/736x/87/d2/39/87d239c65732f941a8f2d9cce9f245f9.jpg",
    },
    workspace: {
      id: "workspace-2",
      name: "Workspace 2",
    },
    createdAt: "2023-01-02",
  },
  {
    id: "3",
    name: "Lab 3",
    githubUrl: "https://github.com/user/lab3",
    creator: {
      name: "User 3",
      image:
        "https://i.pinimg.com/736x/2f/80/75/2f8075995dd1da536aa137d6645d7d02.jpg",
    },
    workspace: {
      id: "workspace-3",
      name: "Workspace 3",
    },
    createdAt: "2023-01-03",
  },
];
