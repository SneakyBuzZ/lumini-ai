import { Button } from "@/components/ui/button";
import { CanvasMode, ShapeType } from "@/lib/types/canvas-type";
import {
  ALargeSmall,
  Circle,
  MousePointer2,
  MoveUpRight,
  Slash,
  Square,
} from "lucide-react";
import { useCanvas } from "@/hooks/use-canvas";
import { cn } from "@/utils/cn.util";
import { useEffect, useState, useCallback } from "react";

const tools = [
  {
    name: "Select",
    icon: MousePointer2,
    key: "S",
    mode: "select",
    type: null,
  },
  {
    name: "Rectangle",
    icon: Square,
    key: "R",
    mode: "draw",
    type: "rectangle",
  },
  { name: "Ellipse", icon: Circle, key: "O", mode: "draw", type: "ellipse" },
  { name: "Line", icon: Slash, key: "L", mode: "draw", type: "line" },
  { name: "Arrow", icon: MoveUpRight, key: "A", mode: "draw", type: "arrow" },
  { name: "Text", icon: ALargeSmall, key: "T", mode: "draw", type: "text" },
];

export function Toolbar() {
  const { store } = useCanvas();
  const [currentMode, setCurrentMode] = useState(store.mode);

  // Sync state when store.mode changes
  useEffect(() => {
    setCurrentMode(store.mode);
  }, [store.mode]);

  // Handle tool selection
  const handleSelectTool = useCallback(
    (type: ShapeType | null, mode: CanvasMode) => {
      store.selection.setMode(mode);
      store.setShapeType(type);
      setCurrentMode(mode);
    },
    [store]
  );

  // Keyboard shortcut support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const tool = tools.find((t) => t.key === key);
      if (tool) {
        handleSelectTool(
          tool.type as ShapeType | null,
          tool.mode as CanvasMode
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSelectTool]);

  return (
    <div className="flex gap-1 p-1 bg-midnight-200/50 z-50 absolute bottom-3 backdrop-blur-sm rounded-md border border-neutral-800/60">
      {tools.map((tool) => (
        <Button
          key={tool.key}
          className={cn(
            "w-10 h-10 flex items-center justify-center border hover:bg-midnight-100",
            {
              "bg-teal/30 border-teal/70 hover:bg-teal/50":
                store.shapeType === tool.type && currentMode === tool.mode,
              "bg-transparent border-0": !(
                store.shapeType === tool.type && currentMode === tool.mode
              ),
            }
          )}
          onClick={() =>
            handleSelectTool(
              tool.type as ShapeType | null,
              tool.mode as CanvasMode
            )
          }
          title={`${tool.name} (${tool.key})`} // show tooltip with key
        >
          <tool.icon className="w-6 h-6" />
        </Button>
      ))}
    </div>
  );
}
