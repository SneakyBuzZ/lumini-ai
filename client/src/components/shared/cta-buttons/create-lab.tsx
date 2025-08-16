import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LabForm from "@/components/layout/forms/lab-form";

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

export default CreateLabButton;
