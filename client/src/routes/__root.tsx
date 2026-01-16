// __root.tsx

import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";

export interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <section className="w-full min-h-screen flex flex-col justify-center items-center font-dm-sans overflow-x-clip">
      <Outlet />
    </section>
  ),
});
