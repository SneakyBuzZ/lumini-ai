import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import InviteForm from "@/components/layout/forms/invite-form";

interface InviteMemberButtonProps {
  children: React.ReactNode;
}

const InviteMemberButton = ({ children }: InviteMemberButtonProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[475px] p-0">
        <DialogHeader className="w-full">
          <DialogTitle className="text-xl border-b py-3 px-4">
            Invite a new Member
          </DialogTitle>
          <DialogDescription className="px-4 pt-2 text-sm text-neutral-500">
            Invite members to your workspace by entering their email addresses.
            They will receive an invitation to join at the provided email.
          </DialogDescription>
        </DialogHeader>
        <InviteForm />
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberButton;
