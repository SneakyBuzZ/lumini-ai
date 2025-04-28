import { labColumns } from "@/components/table/lab-columns";
import { WorkspaceTable } from "@/components/table/workspace.table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetAllLabs } from "@/lib/data/queries/lab.query";
import { LabWithMembers } from "@/lib/types/lab.type";
import { CirclePlus, Search } from "lucide-react";

const LabsPage = () => {
  const { data: labs } = useGetAllLabs();
  return (
    <div className="flex flex-1 justify-center items-start bg-midnight-300">
      <div className="space-y-5 w-11/12 py-10">
        <div className="space-y-1 w-full">
          <h3 className="text-3xl font-semibold font-space tracking-tight">
            Your Labs
          </h3>
          <p className="text-md text-neutral-500">
            Dive into your personal workspace where each Lab connects to a
            GitHub repo and helps you illuminate what matters.
          </p>
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="flex justify-start items-center gap-3">
            <Button className="gap-1 flex items-center">
              <CirclePlus />
              Lab
            </Button>
            <Button variant={"secondary"} className="gap-1 flex items-center">
              <CirclePlus />
              Workspace
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
        {(labs ?? []).length > 0 ? (
          <WorkspaceTable<LabWithMembers>
            columns={labColumns}
            data={labs ?? []}
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
    </div>
  );
};

export default LabsPage;
