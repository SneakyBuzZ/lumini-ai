import { Button } from "@/components/ui/button";
import { CanvasMode, CanvasShape } from "@/lib/types/canvas-type";
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
import EdgeDropdown from "./edge-dropdown";
import TextSizeDropdown from "./textsize-dropdown";
import FillDropdown from "./fill-dropdown";
import { ShapeKind } from "@/lib/types/lab-type";

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
  const [selectedShapes, setSelectedShapes] = useState<CanvasShape[]>([]);

  useEffect(() => {
    setCurrentMode(store.mode);
  }, [store.mode]);

  const handleSelectTool = useCallback(
    (type: ShapeKind | null, mode: CanvasMode) => {
      store.selection.setMode(mode);
      store.setShapeType(type);
      setCurrentMode(mode);
    },
    [store],
  );

  // Keyboard shortcut support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedShapes.length > 0) return;
      const key = e.key.toUpperCase();
      const tool = tools.find((t) => t.key === key);
      if (tool) {
        handleSelectTool(
          tool.type as ShapeKind | null,
          tool.mode as CanvasMode,
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSelectTool, selectedShapes.length]);

  useEffect(() => {
    const handleShapes = () => {
      const shapes = Object.values(store.shapes);
      const anySelected = shapes.filter((s) => s.isSelected);
      setSelectedShapes(anySelected);
    };

    handleShapes();
  }, [store.shapes]);

  return (
    <div className="flex items-center justify-center h-14 p-[3px] bg-midnight-200/70 z-50 absolute bottom-4 backdrop-blur-sm rounded-xl border border-midnight-100/80 transition-all duration-300">
      {tools.map((tool) => (
        <Button
          key={tool.key}
          className={cn(
            "w-11 h-11 flex items-center justify-center border hover:bg-midnight-100 rounded-[8px] mx-[2px]",
            {
              "bg-teal/30 border-teal/70 hover:bg-teal/50":
                store.shapeType === tool.type && currentMode === tool.mode,
              "bg-transparent border-transparent": !(
                store.shapeType === tool.type && currentMode === tool.mode
              ),
            },
          )}
          onClick={() =>
            handleSelectTool(
              tool.type as ShapeKind | null,
              tool.mode as CanvasMode,
            )
          }
          title={`${tool.name} (${tool.key})`}
        >
          <tool.icon className="w-6 h-6" />
        </Button>
      ))}
      <div
        className={cn(
          "flex items-center overflow-hidden transition-all duration-300 ease-in-out",
          selectedShapes.length > 0
            ? "max-w-[300px] opacity-100"
            : "gap-0 max-w-0 opacity-0",
        )}
      >
        <div className="h-7 bg-neutral-800 p-[0.6px] mx-[6px]"></div>
        <EdgeDropdown selectedShapes={selectedShapes} />
        <FillDropdown selectedShapes={selectedShapes} />
        <TextSizeDropdown selectedShapes={selectedShapes} />
      </div>
    </div>
  );
}
