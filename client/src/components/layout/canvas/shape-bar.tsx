import useCanvasStore from "@/lib/store/canvas-store";
import { Button } from "@/components/ui/button";
import { ShapeType } from "@/lib/types/canvas.type";
import { ALargeSmall, Circle, MoveUpRight, Slash, Square } from "lucide-react";

const tools = [
  {
    name: "Rectangle",
    icon: Square,
    key: "R",
    type: "rectangle",
  },
  {
    name: "Ellipse",
    icon: Circle,
    key: "O",
    type: "ellipse",
  },
  {
    name: "Line",
    icon: Slash,
    key: "L",
    type: "line",
  },
  {
    name: "Arrow",
    icon: MoveUpRight,
    key: "A",
    type: "arrow",
  },
  {
    name: "Text",
    icon: ALargeSmall,
    key: "T",
    type: "text",
  },
];

export function Toolbar() {
  const { currentShape, setShape } = useCanvasStore();

  return (
    <div className="flex gap-2 p-2 bg-midnight-200/50 z-50 absolute bottom-5 backdrop-blur-sm rounded-md border border-neutral-800/60">
      {tools.map((tool) => (
        <Button
          key={tool.key}
          variant="outline"
          className={`${
            currentShape === tool.type ? "bg-midnight-100" : "bg-midnight-200"
          } hover:bg-midnight-200 h-10 w-10`}
          onClick={() => setShape(tool.type as ShapeType)}
        >
          <tool.icon size={16} />
        </Button>
      ))}
    </div>
  );
}
