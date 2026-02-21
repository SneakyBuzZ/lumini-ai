import { Badge } from "@/components/ui/badge";
import { Workspace } from "@/lib/types/workspace-type";
import { Route } from "@/routes/dashboard/space/$slug/route";
import { BriefcaseBusiness, ChevronsUpDownIcon, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WorkspaceDropdownProps {
  workspaces: Workspace[];
}

export default function WorkspaceDropdown({
  workspaces,
}: WorkspaceDropdownProps) {
  const { slug } = Route.useParams();
  const currentWorkspace = workspaces.find((ws) => ws.slug === slug);
  const navigate = Route.useNavigate();

  const handleWorkspaceSwitch = (workspaceSlug: string) => {
    navigate({ to: "/dashboard/space/$slug", params: { slug: workspaceSlug } });
  };

  return (
    <div className="flex items-center space-x-3">
      <span className="flex gap-2 items-center text-neutral-100">
        <BriefcaseBusiness className="w-4" />
        {currentWorkspace?.name}
      </span>
      <Badge className="text-[10px]" variant={currentWorkspace?.plan || "free"}>
        {currentWorkspace?.plan.toLocaleUpperCase() || "FREE"}
      </Badge>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-7 w-7 p-0 data-[state=open]:bg-midnight-100"
          >
            <ChevronsUpDownIcon className="!w-3 !h-3 " />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          onCloseAutoFocus={(e) => e.preventDefault()}
          align="start"
          className="min-w-64 text-neutral-200 bg-midnight-300/90 backdrop-blur-lg border-midnight-100"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs">
              Switch Workspaces
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-midnight-100 h-[0.5px]" />
            {workspaces.map((ws) => (
              <DropdownMenuItem
                key={ws.id}
                className="text-xs"
                onClick={() => handleWorkspaceSwitch(ws.id)}
              >
                <BriefcaseBusiness className="w-4" />
                {ws.name}
                <Badge
                  variant={ws.plan || "free"}
                  className="ml-auto text-[10px]"
                >
                  {ws.plan.toLocaleUpperCase() || "FREE"}
                </Badge>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-midnight-100 h-[0.5px]" />
            <DropdownMenuItem className="text-xs">
              All Workspaces
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-midnight-100 h-[0.5px]" />
          <DropdownMenuItem className="text-xs">
            <Plus />
            New Workspace
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
