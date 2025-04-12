import { Navigate, Route, Routes } from "react-router-dom";
import NotFoundPage from "@/app/pages/not-found.page";
import HomePage from "@/app/pages/home.page";
import RegisterPage from "@/app/pages/register.page";
import LoginPage from "@/app/pages/login.page";
import AppLayout from "@/app/layout/app.layout";
import {
  useGetIsAuthenticated,
  useGetUser,
} from "@/lib/data/queries/user.query";
import useAuthStore from "@/lib/store/auth.store";
import { useEffect } from "react";
import AuthLayout from "@/app/layout/auth.layout";
import LabsPage from "@/app/pages/labs.page";
import WorkspacePage from "./pages/workspaces.page";
import useUserStore from "@/lib/store/user.store";

function App() {
  const { setAuthenticated } = useAuthStore();
  const { data: isAuthenticated } = useGetIsAuthenticated();
  const { data: user } = useGetUser();
  const { setUser } = useUserStore();

  useEffect(() => {
    setAuthenticated(isAuthenticated ?? false);
  }, [isAuthenticated, setAuthenticated]);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser, isAuthenticated, setAuthenticated]);

  return (
    <section className="w-full min-h-svh flex flex-col justify-start items-center p-0 m-0 dark:bg-midnight-300 font-spline tracking-tight">
      <div className="container min-h-svh flex flex-col justify-start items-center p-0 m-0 dark:bg-midnight-300">
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/app" element={<Navigate to="/app/labs" replace />} />

          <Route path="/auth" element={<AuthLayout />}>
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
          </Route>
          <Route path="/app" element={<AppLayout />}>
            <Route path="labs" element={<LabsPage />} />
            <Route path="/app/workspaces" element={<WorkspacePage />} />
          </Route>
        </Routes>
      </div>
    </section>
  );
}

export default App;
