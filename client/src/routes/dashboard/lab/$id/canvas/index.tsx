import { createFileRoute } from "@tanstack/react-router";
import { Canvas } from "@/components/layout/canvas/dom.canvas";
import { Toolbar } from "@/components/layout/canvas/shape-bar";

export const Route = createFileRoute("/dashboard/lab/$id/canvas/")({
  component: CanvasPage,
});

export default function CanvasPage() {
  return (
    <div className="w-full flex flex-col justify-start items-center relative">
      <Toolbar />
      <Canvas />
    </div>
  );
}
