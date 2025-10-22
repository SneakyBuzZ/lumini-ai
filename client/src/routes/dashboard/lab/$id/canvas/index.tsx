import { createFileRoute } from "@tanstack/react-router";
import { Canvas } from "@/components/layout/canvas/dom.canvas";
import { Toolbar } from "@/components/layout/canvas/shape-bar";

export const Route = createFileRoute("/dashboard/lab/$id/canvas/")({
  component: CanvasPage,
});

function CanvasPage() {
  return (
    <div className="h-full w-full relative bg-canvas bg-midnight-300/70 flex flex-col justify-start items-center overflow-hidden">
      <Toolbar />
      <Canvas />
    </div>
  );
}
