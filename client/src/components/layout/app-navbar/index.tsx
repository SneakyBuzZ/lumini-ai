import { Slash } from "lucide-react";
import { User } from "@/lib/types/user-type";
import { useLocation } from "@tanstack/react-router";

import Logo from "@/components/shared/logo";
import { UserProfile } from "./user-profile";
import { Workspace } from "@/lib/types/workspace-type";
import WorkspaceDropdown from "./workspace-dropdown";

interface AppNavbarProps {
  user: User | null;
  workspaces: Workspace[];
}

const labelMap: Record<string, string> = {
  new: "New Workspace",
  space: "Workspace",
};

const AppNavbar = ({ user, workspaces }: AppNavbarProps) => {
  const { pathname } = useLocation();
  const last = pathname.split("/").filter(Boolean).slice(-1)[0];
  const label =
    labelMap[last] ||
    last.slice(0, 1).toUpperCase() + last.slice(1).replace(/-/g, " ");
  const isLabelValid = Object.keys(labelMap).includes(last);

  return (
    <nav className="w-full h-[50px] flex justify-between items-center backdrop-blur-md px-7 border-b border-midnight-100 shrink-0">
      <div className="flex space-x-3 items-center">
        <Logo imgClassName="size-5" />
        <Seperator />

        {isLabelValid ? (
          <span className="text-md text-neutral-100  tracking-tight">
            {label}
          </span>
        ) : (
          <WorkspaceDropdown workspaces={workspaces} />
        )}
      </div>
      <div className="flex justify-end items-center gap-2">
        {user && <UserProfile user={user} />}
      </div>
    </nav>
  );
};

function Seperator() {
  return (
    <Slash className="size-3 text-neutral-700 -rotate-12" strokeWidth={2} />
  );
}

export default AppNavbar;
