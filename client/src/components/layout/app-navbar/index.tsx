import { Slash } from "lucide-react";
import { User } from "@/lib/types/user-type";
import { useMatch } from "@tanstack/react-router";

import Logo from "@/components/shared/logo";
import { UserProfile } from "./user-profile";
import { Workspace } from "@/lib/types/workspace-type";
import WorkspaceDropdown from "./workspace-dropdown";

interface AppNavbarProps {
  user: User | null;
  workspaces: Workspace[];
}

const AppNavbar = ({ user, workspaces }: AppNavbarProps) => {
  const newMatch = useMatch({
    from: "/dashboard/new/",
    shouldThrow: false,
  });
  const isNewRoute = !!newMatch;

  const spaceMatch = useMatch({
    from: "/dashboard/space/$slug",
    shouldThrow: false,
  });
  const isSpaceRoute = !!spaceMatch;

  const newSlugMatch = useMatch({
    from: "/dashboard/new/$slug/",
    shouldThrow: false,
  });
  const isNewSlugRoute = !!newSlugMatch;

  return (
    <nav className="w-full h-[50px] flex justify-between items-center backdrop-blur-md px-7 border-b border-midnight-100 shrink-0">
      <div className="flex space-x-3 items-center">
        <Logo imgClassName="size-5" />
        <Seperator />
        {isNewRoute && (
          <span className="text-md text-neutral-100  tracking-tight">
            New Workspace
          </span>
        )}
        {(isSpaceRoute || isNewSlugRoute) && (
          <>
            <WorkspaceDropdown workspaces={workspaces} />
          </>
        )}
        {isNewSlugRoute && (
          <>
            <Seperator />
            <span className="text-md text-neutral-100  tracking-tight">
              New Laboratory
            </span>
          </>
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
