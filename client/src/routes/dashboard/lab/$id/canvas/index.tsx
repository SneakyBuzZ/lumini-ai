import { createFileRoute } from "@tanstack/react-router";
import { Canvas } from "@/components/layout/canvas/dom.canvas";
import { Toolbar } from "@/components/layout/canvas/shape-bar";
import { getSnapshot } from "@/lib/api/lab-api";
import { delay } from "@/utils/delay";
import Loading from "@/components/shared/loading";

export const Route = createFileRoute("/dashboard/lab/$id/canvas/")({
  loader: async ({ context, params }) => {
    const snapshot = await context.queryClient.ensureQueryData({
      queryKey: ["lab-snapshot", params.id],
      queryFn: () => getSnapshot(params.id),
    });
    await delay(1000);
    return snapshot;
  },
  pendingComponent: () => <Loading />,
  component: CanvasPage,
});

function CanvasPage() {
  const snapshot = Route.useLoaderData();
  return (
    <div className="h-full w-full relative bg-canvas bg-midnight-300/70 flex flex-col justify-start items-center overflow-hidden">
      <Toolbar />
      <Canvas snapshot={snapshot} />
    </div>
  );
}
