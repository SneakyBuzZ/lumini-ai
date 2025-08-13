import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";

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
    <Breadcrumb className="hidden md:flex items-center p-4 px-6 absolute z-50 backdrop-blur-sm">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {filteredPaths.map((path, index) => (
          <BreadcrumbItem key={index}>
            <span>{path.charAt(0).toUpperCase() + path.slice(1)}</span>
            <BreadcrumbSeparator />
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default NavbarBreadcrumb;
