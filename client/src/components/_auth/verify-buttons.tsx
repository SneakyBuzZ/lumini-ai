import { useResendVerificationEmail } from "@/lib/api/mutations/user-mutations";
import { Button } from "../ui/button";
import Spinner from "../shared/spinner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import ChangeEmailForm from "../layout/forms/change-email-form";

interface VerifyButtonsProps {
  email: string;
}

export default function VerifyButtons({ email }: VerifyButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    mutateAsync: resendEmail,
    isPending,
    isSuccess,
  } = useResendVerificationEmail();

  async function handleResend() {
    await resendEmail();
  }

  return (
    <div className="w-full grid grid-cols-2 border-y border-dashed border-neutral-700 px-20">
      <div className="space-y-3 border-r border-dashed border-neutral-700 pr-20 h-full py-10">
        <h2 className="text-md text-neutral-300">Didn't receive the email?</h2>
        <Button onClick={handleResend} disabled={isPending || isSuccess}>
          {isPending ? (
            <>
              <Spinner />
              Sending
            </>
          ) : (
            <>
              {isSuccess
                ? "Verification Email Sent!"
                : "Resend Verification Email"}
            </>
          )}
        </Button>
        {isSuccess && (
          <p className="text-xs text-neutral-500">
            Please check your inbox. It may take a few minutes to arrive.
          </p>
        )}
      </div>
      <div className="space-y-3 pl-20 h-full py-10">
        <h2 className="text-md text-neutral-300">Wrong email?</h2>
        <Button variant={"outline"} onClick={() => setIsOpen((prev) => !prev)}>
          Change Email Address
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent className="p-0 bg-midnight-300 border border-neutral-800">
          <DialogHeader>
            <DialogTitle className="p-4 text-neutral-200 border-b border-neutral-800">
              To change your email address
            </DialogTitle>
            <DialogDescription className="p-4 py-2">
              Please enter your new email address. We will send you a new
              verification email to that address.
            </DialogDescription>
          </DialogHeader>
          <div className="px-4 pb-4">
            <ChangeEmailForm email={email} />
          </div>
          <DialogFooter className="p-4 py-2 border-t border-neutral-800 items-center">
            <span className="text-xs">
              Note: Changing your email will require you to verify the new
              email.
            </span>
            <Button variant={"outline"} onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
