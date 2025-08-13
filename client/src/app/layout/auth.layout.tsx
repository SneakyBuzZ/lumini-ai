import useAuthStore from "@/lib/store/auth-store";
import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const { authenticated } = useAuthStore();

  if (authenticated) {
    return <Navigate to={"/app/workspaces"} />;
  } else {
    return (
      <>
        <div className="w-full relative">
          <Outlet />
        </div>
      </>
    );
  }
};

export default AuthLayout;
