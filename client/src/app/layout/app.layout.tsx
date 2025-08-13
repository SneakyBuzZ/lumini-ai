import NavbarBreadcrumb from "@/components/shared/breadcrumb";
import AppSidebar from "@/components/sidebar/app.sidebar";
import { useUserWithStore } from "@/lib/data/queries/user.query";
import { useGetWorkspaceWithStore } from "@/lib/data/queries/workspace.query";
import useAuthStore from "@/lib/store/auth.store";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "sonner";

const AppLayout = () => {
  const { authenticated } = useAuthStore();
  const { data: user } = useUserWithStore();
  useGetWorkspaceWithStore();

  useEffect(() => {
    if (user) {
      toast.success(`Welcome back, ${user.email}`);
    }
  }, [user]);

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
