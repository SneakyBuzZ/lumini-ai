import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useCanvasStore from "@/lib/store/canvas-store";
import { CanvasShape } from "@/lib/types/canvas-type";
import { cn } from "@/utils/cn.util";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { Check, Maximize, Square, SquareDashed } from "lucide-react";
import { useEffect, useState } from "react";

const colors = [
  {
    name: "White",
    class: "bg-neutral-300 border-neutral-300",
    hash: "#a0a0a0",
  },
  {
    name: "Red",
    class: "bg-[#f85757ff] border-[#ff3b3bff]",
    hash: "#fc8181a6",
  },
  {
    name: "Green",
    class: "bg-[#458645] border-[#1ba01b]",
    hash: "#4586459a",
  },
  {
    name: "Blue",
    class: "bg-[#3f83f8] border-[#3f83f8]",
    hash: "#3f83f896",
  },
  {
    name: "Purple",
    class: "bg-[#8c38ec] border-[#8c38ec]",
    hash: "#8c38ec8c",
  },
  {
    name: "Pink",
    class: "bg-[#fdc0ff] border-[#fdc0ff]",
    hash: "#ffc0cbb6",
  },
  {
    name: "Orange",
    class: "bg-[#ffa53e] border-[#ffa53e]",
    hash: "#ffa6009a",
  },
  {
    name: "None",
    class: "bg-none border",
    hash: "transparent",
  },
];

interface EdgeDropdownProps {
  selectedShapes: CanvasShape[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EdgeDropdown({
  selectedShapes,
  open,
  onOpenChange,
}: EdgeDropdownProps) {
  const store = useCanvasStore();

  const [currentColor, setCurrentColor] = useState<string | null>(null);
  const [currentStroke, setCurrentStroke] = useState<
    "solid" | "dashed" | "dotted" | null
  >(null);
  const [currentStrokeWidth, setCurrentStrokeWidth] = useState<number | null>(
    null,
  );

  // Sync UI
  useEffect(() => {
    if (selectedShapes.length > 0) {
      const s = selectedShapes[0];
      setCurrentColor(s.strokeColor);
      setCurrentStroke(s.strokeType);
      setCurrentStrokeWidth(s.strokeWidth);
    } else {
      const prefs = store.toolPreferences;
      setCurrentColor(prefs.strokeColor);
      setCurrentStroke(prefs.strokeType);
      setCurrentStrokeWidth(prefs.strokeWidth);
    }
  }, [selectedShapes, store.toolPreferences]);

  const applyToSelection = (partial: Partial<CanvasShape>) => {
    if (selectedShapes.length === 0) return;

    const updates: Record<string, Partial<CanvasShape>> = {};
    selectedShapes.forEach((shape) => {
      updates[shape.id] = partial;
    });

    store.shapesActions.batchUpdate(updates);

    selectedShapes.forEach((shape) => {
      store.shapesActions.commitShape(shape.id, "updated");
    });
  };

  const setStrokeColor = (color: string) => {
    store.toolPreferencesActions.set("strokeColor", color);
    applyToSelection({ strokeColor: color });
  };

  const setStrokeType = (type: "solid" | "dashed" | "dotted") => {
    store.toolPreferencesActions.set("strokeType", type);
    applyToSelection({ strokeType: type });
  };

  const setStrokeWidth = (width: number) => {
    store.toolPreferencesActions.set("strokeWidth", width);
    applyToSelection({ strokeWidth: width });
  };

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger className="w-10 h-10 flex items-center justify-center hover:bg-midnight-100 border-0 rounded-lg">
        <img className="w-6 h-6" src={"/assets/icons/edges.svg"} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="-translate-y-4 bg-midnight-200/90 border-midnight-100 backdrop-blur-md">
        <DropdownMenuLabel className="grid grid-cols-4 items-center justify-start w-full gap-1 p-1">
          <button
            onClick={() => setStrokeType("solid")}
            className={cn(
              "flex justify-center items-center h-8 w-8 cursor-pointer rounded-md bg-midnight-100",
              { "ring-[1px] ring-teal": currentStroke === "solid" },
            )}
          >
            <Square className="h-5 w-5 opacity-90" />
          </button>
          <button
            onClick={() => setStrokeType("dashed")}
            className={cn(
              "flex justify-center items-center h-8 w-8 cursor-pointer rounded-md bg-midnight-100",
              { "ring-[1px] ring-teal": currentStroke === "dashed" },
            )}
          >
            <Maximize className="h-5 w-5 opacity-80" />
          </button>
          <button
            onClick={() => setStrokeType("dotted")}
            className={cn(
              "flex justify-center items-center h-8 w-8 cursor-pointer rounded-md bg-midnight-100",
              { "ring-[1px] ring-teal": currentStroke === "dotted" },
            )}
          >
            <SquareDashed className="h-5 w-5 opacity-90" />
          </button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-midnight-100" />
        <DropdownMenuLabel className="grid grid-cols-4 items-center justify-start w-full gap-1 p-1">
          {colors.map((color) => (
            <button
              key={color.name}
              className={`h-8 w-full  border ${color.class} p-1 rounded-md cursor-pointer`}
              onClick={() => setStrokeColor(color.hash)}
            >
              {currentColor === color.hash && (
                <Check
                  className={cn(
                    currentColor === null ? "border-black" : "border-#2b2b2b",
                  )}
                />
              )}
            </button>
          ))}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-midnight-100" />
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          onClick={() => setStrokeWidth(0.2)}
          className={cn(
            "flex items-center gap-5 hover:bg-midnight-100/80",
            currentStrokeWidth === 0.2 && "bg-teal hover:bg-teal",
          )}
        >
          <span className="text-sm text-white w-3">S</span>
          <img src="/assets/icons/edge-s.svg" alt="Edge 1" className="flex-1" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          onClick={() => setStrokeWidth(0.5)}
          className={cn(
            "flex items-center gap-5 hover:bg-midnight-100/80",
            currentStrokeWidth === 0.5 && "bg-teal hover:bg-teal",
          )}
        >
          <span className="text-sm text-white w-3">M</span>
          <img src="/assets/icons/edge-m.svg" alt="Edge 2" className="flex-1" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          onClick={() => setStrokeWidth(1)}
          className={cn(
            "flex items-center gap-5 hover:bg-midnight-100/80",
            currentStrokeWidth === 1 && "bg-teal hover:bg-teal",
          )}
        >
          <span className="text-sm text-white w-3">L</span>
          <img src="/assets/icons/edge-l.svg" alt="Edge 3" className="flex-1" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          onClick={() => setStrokeWidth(2)}
          className={cn(
            "flex items-center gap-5 hover:bg-midnight-100/80",
            currentStrokeWidth === 2 && "bg-teal hover:bg-teal",
          )}
        >
          <span className="text-sm text-white w-3">XL</span>
          <img
            src="/assets/icons/edge-xl.svg"
            alt="Edge 4"
            className="flex-1"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
