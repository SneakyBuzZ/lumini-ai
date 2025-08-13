import { Canvas } from "@/components/canvas/dom.canvas";
import { Toolbar } from "@/components/canvas/shape-bar";

export default function Whiteboard() {
  return (
    <div className="h-full w-full flex flex-col justify-start items-center relative p-0 m-0">
      <Toolbar />
      <Canvas />
    </div>
  );
}
