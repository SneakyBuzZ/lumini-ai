import NavbarBreadcrumb from "@/components/shared/breadcrumb";
import AppSidebar from "@/components/sidebar/app.sidebar";
import { useGetWorkspaceWithStore } from "@/lib/data/queries/workspace-queries";
import useAuthStore from "@/lib/store/auth-store";
import { Navigate, Outlet } from "react-router-dom";

const AppLayout = () => {
  const { authenticated } = useAuthStore();
  useGetWorkspaceWithStore();

  if (!authenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <div className="w-full h-svh relative flex font-spline">
        <AppSidebar />
        <div className="flex h-full flex-1 flex-col">
          <NavbarBreadcrumb />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AppLayout;
