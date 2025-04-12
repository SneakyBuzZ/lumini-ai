import NavbarBreadcrumb from "@/components/shared/breadcrumb";
import AppSidebar from "@/components/sidebar/app.sidebar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  // const { authenticated } = useAuthStore();

  // if (!authenticated) {
  //   return <Navigate to={"/"} />;
  // }

  return (
    <>
      <div className="w-full h-screen relative flex font-spline">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <NavbarBreadcrumb />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AppLayout;
