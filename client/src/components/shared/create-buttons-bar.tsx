import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LabForm from "@/components/layout/forms/lab-form";
import { Button } from "@/components/ui/button";
import { CirclePlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import WorkspaceForm from "@/components/layout/forms/workspace-form";

export default function CreateButtonsBar() {
  return (
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
  );
}

interface CreateLabButtonProps {
  children: React.ReactNode;
}

const CreateLabButton = ({ children }: CreateLabButtonProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[575px] p-0">
        <DialogHeader className="w-full">
          <DialogTitle className="text-xl border-b py-3 px-4">
            Create a new Lab
          </DialogTitle>
          <DialogDescription className="px-4 pt-2 text-sm text-neutral-500">
            Labs are your personal space to create and experiment with your
            code. Each lab has its own settings and configurations.
          </DialogDescription>
        </DialogHeader>
        <LabForm />
      </DialogContent>
    </Dialog>
  );
};

interface CreateWorkspaceButtonProps {
  triggerLabel?: string;
  children: React.ReactNode;
}

const CreateWorkspaceButton = ({ children }: CreateWorkspaceButtonProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px] p-0">
        <DialogHeader className="w-full">
          <DialogTitle className="text-xl border-b py-3 px-4">
            Create a new Workspace
          </DialogTitle>
          <DialogDescription className="px-4 pt-2 text-sm text-neutral-500">
            Workspaces are your personal space to create and experiment with
            your code. Each workspace has its own labs and settings.
          </DialogDescription>
        </DialogHeader>
        <WorkspaceForm />
      </DialogContent>
    </Dialog>
  );
};
