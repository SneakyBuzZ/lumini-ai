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

  const ignorePaths = [
    "handbook",
    "resource",
    "app",
    "507b74a2-21b3-4d85-b676-a1cb0629b014",
    "cmgwqmdcu0000xsl7cy5e15s2",
  ];

  const filteredPaths = paths.filter((path) => !ignorePaths.includes(path));

  return (
    <Breadcrumb className="hidden md:flex items-center">
      <BreadcrumbList>
        {filteredPaths.map((path, index) => (
          <BreadcrumbLink
            className="cursor-pointer flex gap-2 items-center"
            key={index}
          >
            <span>{path.charAt(0).toUpperCase() + path.slice(1)}</span>
            {index != 0 && <BreadcrumbSeparator />}
          </BreadcrumbLink>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default NavbarBreadcrumb;
