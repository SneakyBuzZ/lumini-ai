// __root.tsx

import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <section className="w-full min-h-screen flex flex-col font-poppins overflow-x-clip">
      <Outlet />
      <TanStackRouterDevtools />
    </section>
  ),
});
