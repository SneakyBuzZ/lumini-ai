import { Route, Routes } from "react-router-dom";
import NotFoundPage from "@/app/pages/not-found.page";
import HomePage from "@/app/pages/home.page";
import RegisterPage from "@/app/pages/register.page";
import LoginPage from "@/app/pages/login.page";
import AppLayout from "@/app/layout/app.layout";
import { useGetIsAuthenticated } from "@/lib/data/queries/user.query";
import useAuthStore from "@/lib/store/auth.store";
import { useEffect } from "react";
import AuthLayout from "@/app/layout/auth.layout";
import LabsPage from "@/app/pages/labs.page";
import WorkspacePage from "@/app/pages/workspaces.page";
import { Toaster } from "@/components/ui/sonner";
import LabPage from "./pages/lab.page";
import AskPage from "./pages/ask.page";
import Whiteboard from "./pages/draw.page";
import PlanComparison from "./pages/billing.page";
import SettingsPage from "./pages/workspace/settings";

function App() {
  const { setAuthenticated } = useAuthStore();
  const { data: isAuthenticated } = useGetIsAuthenticated();

  useEffect(() => {
    setAuthenticated(isAuthenticated ?? false);
  }, [isAuthenticated, setAuthenticated]);

  return (
    <section className="w-full border h-full flex flex-col justify-start items-center p-0 m-0 dark:bg-black font-spline tracking-tight">
      <Toaster
        toastOptions={{
          className: "bg-midnight-300 text-white",
          duration: 3000,
          style: {
            background: "#1e1e2f",
            color: "#fff",
          },
        }}
        closeButton={false}
        position="top-right"
      />
      <div className="w-full min-h-svh flex flex-col justify-start items-center p-0 m-0">
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
          <Route index element={<HomePage />} />

          <Route path="/auth" element={<AuthLayout />}>
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
          </Route>
          <Route path="/app" element={<AppLayout />}>
            <Route path="/app/labs" element={<LabsPage />} />
            <Route path="/app/labs/:labId" element={<LabPage />} />
            <Route path="/app/labs/:labId/files" element={<LabPage />} />
            <Route
              path="/app/labs/:labId/whiteboard"
              element={<Whiteboard />}
            />
            <Route path="/app/labs/:labId/settings" element={<LabPage />} />
            <Route path="/app/labs/:labId/ask" element={<AskPage />} />
            <Route path="/app/workspaces" element={<WorkspacePage />} />
            <Route path="/app/billing" element={<PlanComparison />} />
            <Route path="/app/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </div>
    </section>
  );
}

export default App;
