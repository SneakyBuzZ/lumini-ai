import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useGetWorkspaces } from "@/lib/api/queries/app-queries";
import { Workspace } from "@/lib/types/workspace-type";
import { useLocation } from "@tanstack/react-router";

const NavbarBreadcrumb = () => {
  const { pathname } = useLocation();
  const paths = pathname.split("/");

  const { data: workspaces } = useGetWorkspaces();

  const ignorePaths = ["space"];
  const filteredPaths = paths.filter((path) => !ignorePaths.includes(path));

  return (
    <Breadcrumb className="hidden md:flex items-center">
      <BreadcrumbList>
        {filteredPaths.map((path, index) => {
          let label = path.charAt(0).toUpperCase() + path.slice(1);
          if (path.startsWith("cmg")) {
            label = getWorkspaceName(path, workspaces || []);
          }
          return (
            <BreadcrumbLink
              className="cursor-pointer flex gap-2 items-center"
              key={index}
            >
              <span>{label}</span>
              {index != 0 && <BreadcrumbSeparator />}
            </BreadcrumbLink>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

function getWorkspaceName(workspaceId: string, workspaces: Workspace[]) {
  return workspaces.find((w) => w.id === workspaceId)?.name || "Workspace";
}

export default NavbarBreadcrumb;
