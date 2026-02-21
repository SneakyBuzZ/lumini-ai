import { useResendVerificationEmail } from "@/lib/api/mutations/user-mutations";
import { verifyEmail } from "@/lib/api/user-api";
import { useNavigate } from "@tanstack/react-router";
import { CircleAlert, CircleCheck, IterationCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Spinner from "../shared/spinner";
import { Button } from "../ui/button";

export function GreetToken({ token }: { token: string }) {
  const {
    mutateAsync: resendMail,
    isPending: isMailPending,
    isSuccess: isMailSuccess,
  } = useResendVerificationEmail();
  const [message, setMessage] = useState("Verifying");
  const [isPending, setIsPending] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    async function verify() {
      const response = await verifyEmail(token);
      if (response.success) {
        setMessage("Verification successful! Redirecting...");
        setIsSuccess(true);
        toast("Email verified successfully! Redirecting to dashboard...");
        navigate({ to: "/dashboard/new" });
      } else {
        setMessage(response.message);
      }
      setIsPending(false);
    }
    verify();
  }, [token, navigate]);

  const handleResend = async () => {
    await resendMail();
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-6">
      <div className="flex gap-2 items-center">
        <IterationCcw className="text-teal" />
        <h2 className="text-xl text-neutral-300 font-semibold">
          Verifying Your Account
        </h2>
      </div>
      <p className="w-full text-md text-center px-20 text-neutral-500">
        Thank you for clicking the verification link. We are currently verifying
        your account. This may take a few moments. Please do not refresh or
        close this page.
      </p>
      <div className="flex flex-col justify-center items-center gap-6">
        {isPending ? (
          <div className="flex items-center gap-2">
            <Spinner />
            <span className="text-neutral-400">{message}</span>
          </div>
        ) : (
          <>
            {isSuccess ? (
              <>
                {" "}
                <div className="flex flex-col justify-center items-center gap-2">
                  <Button
                    variant={"secondary"}
                    onClick={() => navigate({ to: "/dashboard" })}
                  >
                    Continue to Dashboard
                  </Button>
                  <span className="text-sm text-neutral-500">
                    If you are not redirected automatically, click the button
                    above.
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <CircleAlert className="text-red-400" />
                  <span className="text-neutral-400">{message}</span>
                </div>
                <Button
                  onClick={handleResend}
                  disabled={isMailPending || isMailSuccess}
                >
                  {isMailPending ? (
                    <>
                      <Spinner />
                      Loading
                    </>
                  ) : (
                    <>
                      {isMailSuccess
                        ? "Verification Email Sent! Please Check Your Inbox"
                        : "Resend Verification Email"}
                    </>
                  )}
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function GreetEmail({ email }: { email: string }) {
  return (
    <div className="w-full flex-1 flex flex-col justify-center items-center gap-2 border-b border-dashed border-neutral-700 py-10">
      <div className="flex gap-2 items-center">
        <CircleCheck className="text-teal" />
        <h2 className="text-xl text-neutral-300 font-semibold">
          Account Created
        </h2>
      </div>
      <div className="flex flex-col justify-center items-center gap-1 max-w-lg">
        <p className="text-neutral-400 text-lg text-center">
          We have sent you a verification email{" "}
          <span className="text-neutral-300 font-serif italic">
            {email || ""}
          </span>
        </p>
      </div>
    </div>
  );
}
