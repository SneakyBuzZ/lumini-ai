import Logo from "@/components/shared/logo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { CirclePlus, Search, Slash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CreateWorkspaceButton from "@/components/shared/cta-buttons/create-workspace";
import { Input } from "@/components/ui/input";
import { useGetWorkspaces } from "@/lib/api/queries/app-queries";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Workspace } from "@/lib/types/workspace-type";
import { useEffect, useMemo, useState } from "react";
import { getWorkspaceIdByLabSlug } from "@/lib/api/workspace-api";

const HeaderSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: workspaces = [] } = useGetWorkspaces();

  const [search, setSearch] = useState("");
  const [resolvedWorkspace, setResolvedWorkspace] = useState<Workspace | null>(
    null,
  );

  /**
   * URL patterns:
   * /dashboard/space/:workspaceSlug
   * /dashboard/lab/:labSlug
   */
  const [, , scope, slug] = pathname.split("/");

  /**
   * Resolve workspace context
   */
  useEffect(() => {
    if (!workspaces.length || !slug) return;

    // Case 1: explicit workspace route
    if (scope === "space") {
      const ws = workspaces.find((w) => w.slug === slug);
      setResolvedWorkspace(ws ?? null);
      return;
    }

    // Case 2: lab route → resolve via backend
    if (scope === "lab") {
      let cancelled = false;

      (async () => {
        try {
          const workspaceId = await getWorkspaceIdByLabSlug(slug);
          const ws = workspaces.find((w) => w.id === workspaceId);
          if (!cancelled) setResolvedWorkspace(ws ?? null);
        } catch {
          if (!cancelled) setResolvedWorkspace(null);
        }
      })();

      return () => {
        cancelled = true;
      };
    }

    // Fallback
    setResolvedWorkspace(null);
  }, [scope, slug, workspaces]);

  const filteredWorkspaces = useMemo(
    () =>
      workspaces.filter((w) =>
        w.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [workspaces, search],
  );

  const handleWorkspaceChange = (newWorkspaceSlug: string) => {
    if (!resolvedWorkspace) return;
    if (newWorkspaceSlug === resolvedWorkspace.slug) return;

    // Supabase-style UX:
    // switching workspace exits current lab
    navigate({
      to: `/dashboard/space/${newWorkspaceSlug}`,
    });
  };

  // Loading / unresolved state
  if (!resolvedWorkspace || workspaces.length === 0) {
    return (
      <div className="h-[50px] px-3 flex items-center">
        <Logo withText />
      </div>
    );
  }

  return (
    <div className="z-20 h-[50px] px-3 flex items-center">
      <div className="flex items-center w-full gap-2">
        <Logo imgClassName="h-5" />
        <Slash className="-rotate-[20deg] text-neutral-400 h-3" />

        <Select
          value={resolvedWorkspace.slug}
          onValueChange={handleWorkspaceChange}
        >
          <WorkspaceSelectTrigger workspace={resolvedWorkspace} />

          <WorkspaceSelectContent
            workspaces={filteredWorkspaces}
            search={search}
            onSearchChange={setSearch}
          />
        </Select>
      </div>
    </div>
  );
};

function WorkspaceSelectContent({
  workspaces,
  search,
  onSearchChange,
}: {
  workspaces: Workspace[];
  search: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <SelectContent
      align="start"
      className="w-[300px] bg-midnight-200/80 backdrop-blur-md shadow-xl"
    >
      <div className="flex items-center gap-2 px-2 h-10">
        <Search className="h-4 w-4 text-neutral-400" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border-none bg-transparent"
          placeholder="Search workspaces..."
        />
      </div>

      <div className="border-y py-2 max-h-[240px] overflow-auto">
        {workspaces.length === 0 ? (
          <p className="px-3 text-sm text-neutral-500">No workspaces found</p>
        ) : (
          workspaces.map((workspace) => (
            <SelectItem
              key={workspace.id}
              value={workspace.slug}
              className="text-neutral-400 focus:text-white"
            >
              {workspace.name}
            </SelectItem>
          ))
        )}
      </div>

      <div className="p-2">
        <CreateWorkspaceButton>
          <Button
            variant="outline"
            className="h-8 w-full flex justify-start gap-2 bg-midnight-100"
          >
            <CirclePlus className="h-4" />
            Create Workspace
          </Button>
        </CreateWorkspaceButton>
      </div>
    </SelectContent>
  );
}

function WorkspaceSelectTrigger({ workspace }: { workspace: Workspace }) {
  return (
    <SelectTrigger className="border-none bg-transparent px-2">
      <div className="flex items-center gap-2 text-sm text-white">
        <span>{workspace.name}</span>
        <Badge
          variant={workspace.plan}
          className="bg-midnight-100 border border-neutral-800 text-[10px] h-5"
        >
          {workspace.plan}
        </Badge>
      </div>
    </SelectTrigger>
  );
}

export default HeaderSidebar;
