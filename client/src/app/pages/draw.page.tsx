import { Canvas } from "@/components/canvas/dom.canvas";
import { Toolbar } from "@/components/canvas/shape-bar";

export default function Whiteboard() {
  return (
    <div className="h-full flex flex-col justify-start items-center">
      <Toolbar />
      <Canvas />
    </div>
  );
}
