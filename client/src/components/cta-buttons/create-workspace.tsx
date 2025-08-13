import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import WorkspaceForm from "../forms/workspace-form";

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

export default CreateWorkspaceButton;
