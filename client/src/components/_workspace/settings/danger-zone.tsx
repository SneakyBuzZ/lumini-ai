import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";

export function DangerZone() {
  return (
    <div className="w-full bg-red-800/10 border border-dashed border-red-400/20 rounded-xl">
      <div className="flex justify-between items-start">
        <div className="flex flex-col space-y-3 p-6 py-8">
          <div className="flex justify-start items-center gap-2">
            <div className="flex justify-center items-center p-1.5 bg-red-500/60 rounded-lg">
              <TriangleAlert className="size-4 text-white " />
            </div>
            <span className="font-semibold text-lg text-neutral-200">
              Delete Workspace
            </span>
          </div>
          <p className="text-sm text-neutral-500">
            Deleting your workspace is a permanent action that cannot be undone.
            This action will remove all data, projects, and settings associated
            with the workspace. Please proceed with caution and ensure that you
            have backed up any important information before confirming the
            deletion.
          </p>
          <Button variant={"destructive"} className="w-40">
            Delete Workspace
          </Button>
        </div>
      </div>
    </div>
  );
}
