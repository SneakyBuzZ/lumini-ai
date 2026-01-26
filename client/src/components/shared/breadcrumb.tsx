import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation } from "@tanstack/react-router";

const NavbarBreadcrumb = () => {
  const { pathname } = useLocation();
  const paths = pathname.split("/");

  const includePaths = [
    "space",
    "lab",
    "dashboard",
    "ask",
    "canvas",
    "settings",
    "general",
    "",
  ];

  const filteredPaths = paths.filter((path) => includePaths.includes(path));

  return (
    <Breadcrumb className="hidden md:flex items-center">
      <BreadcrumbList>
        {filteredPaths.map((path, index) => {
          return (
            <BreadcrumbLink
              className="cursor-pointer flex gap-2 items-center"
              key={index}
            >
              <span>{path}</span>
              {index != 0 && <BreadcrumbSeparator />}
            </BreadcrumbLink>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default NavbarBreadcrumb;
