import {
  Breadcrumb,
  BreadcrumbItem,
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
  ];

  const filteredPaths = paths.filter((path) => !ignorePaths.includes(path));

  return (
    <Breadcrumb className="hidden md:flex items-center">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">App</BreadcrumbLink>
        </BreadcrumbItem>
        {filteredPaths.map((path, index) => (
          <BreadcrumbItem key={index}>
            <span>{path.charAt(0).toUpperCase() + path.slice(1)}</span>
            {index < filteredPaths.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default NavbarBreadcrumb;
