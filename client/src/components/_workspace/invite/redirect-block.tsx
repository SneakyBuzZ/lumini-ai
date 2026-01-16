import { Button } from "@/components/ui/button";

interface RedirectBlockProps {
  workspace: string;
  handleRedirect: (isLogin: boolean) => void;
}

export default function RedirectBlock({
  workspace,
  handleRedirect,
}: RedirectBlockProps) {
  return (
    <>
      <div className="bg-midnight-200/50 flex flex-col justify-center items-center max-w-lg text-center py-4">
        <p className="text-sm p-2 px-6">
          You have been invited to join the workspace{" "}
          <span className="font-bold">{workspace}</span>. To join, please login
          or create an account.
        </p>
        <div className="w-full flex justify-center items-center gap-2 p-2">
          <Button variant={"primary"} onClick={() => handleRedirect(false)}>
            Register
          </Button>
          <Button onClick={() => handleRedirect(true)}>Login</Button>
        </div>
      </div>
      <div className="w-full border-t border-neutral-800">
        <p className="text-xs text-neutral-500 p-3 px-4 text-center">
          You can check your invitations in your account settings.
        </p>
      </div>
    </>
  );
}
