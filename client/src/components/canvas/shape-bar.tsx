// src/components/Toolbar.tsx
import useCanvasStore, { ShapeType } from "@/lib/store/canvas.store";
import { Button } from "@/components/ui/button";

const tools: ShapeType[] = ["rectangle", "ellipse", "line", "arrow", "text"];

export function Toolbar() {
  const { currentShape, setShape } = useCanvasStore();

  return (
    <div className="flex gap-2 p-2 border-b bg-midnight-300">
      {tools.map((tool) => (
        <Button
          key={tool}
          variant={currentShape === tool ? "default" : "outline"}
          onClick={() => setShape(tool)} // Removed the type parameter <ShapeType>
        >
          {tool}
        </Button>
      ))}
      <Button key="clear" variant="outline">
        Clear
      </Button>
      <Button key="undo" variant="outline">
        Undo
      </Button>
    </div>
  );
}
