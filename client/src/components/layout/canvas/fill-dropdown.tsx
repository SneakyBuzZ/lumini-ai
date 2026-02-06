import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useCanvasStore from "@/lib/store/canvas-store";
import { CanvasShape } from "@/lib/types/canvas-type";
import { cn } from "@/utils/cn.util";
import { Check, PaintBucket } from "lucide-react";
import { useEffect, useState } from "react";

const colors = [
  {
    name: "White",
    class: "bg-neutral-300 border-neutral-300",
    hash: "#ececec46",
  },
  { name: "Red", class: "bg-[#f85757] border-[#ff3b3b]", hash: "#fc6b6b50" },
  { name: "Green", class: "bg-[#458645] border-[#1ba01b]", hash: "#4586453a" },
  { name: "Blue", class: "bg-[#3f83f8] border-[#3f83f8]", hash: "#3f83f828" },
  { name: "Purple", class: "bg-[#8c38ec] border-[#8c38ec]", hash: "#8c38ec49" },
  { name: "Pink", class: "bg-[#fdc0ff] border-[#fdc0ff]", hash: "#ff708857" },
  { name: "Orange", class: "bg-[#ffa53e] border-[#ffa53e]", hash: "#ffa60050" },
  { name: "None", class: "bg-transparent border", hash: "#00000000" },
];

interface FillDropdownProps {
  selectedShapes: CanvasShape[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FillDropdown({
  selectedShapes,
  open,
  onOpenChange,
}: FillDropdownProps) {
  const store = useCanvasStore();
  const [currentFill, setCurrentFill] = useState<string>("#00000000");

  // Sync UI state
  useEffect(() => {
    if (selectedShapes.length > 0) {
      setCurrentFill(selectedShapes[0].fillColor ?? "#00000000");
    } else {
      setCurrentFill(store.toolPreferences.fillColor);
    }
  }, [selectedShapes, store.toolPreferences.fillColor]);

  const applyToSelection = (fillColor: string) => {
    if (selectedShapes.length === 0) return;

    const updates: Record<string, Partial<CanvasShape>> = {};

    selectedShapes.forEach((shape) => {
      updates[shape.id] = { fillColor };
    });

    // 1. Mutate
    store.shapesActions.batchUpdate(updates);

    // 2. Commit (THIS IS THE IMPORTANT PART)
    selectedShapes.forEach((shape) => {
      store.shapesActions.commitShape(shape.id, "updated");
    });
  };

  const setFillColor = (color: string) => {
    // Persist default for new shapes
    store.toolPreferencesActions.set("fillColor", color);

    // Apply to selected shapes
    applyToSelection(color);

    setCurrentFill(color);
  };

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger className="w-10 h-10 flex items-center justify-center gap-1 hover:bg-midnight-100 rounded-lg">
        <PaintBucket className="size-4 text-white" />
        <img
          className="w-[5.5px] h-[5.5px]"
          src="/assets/icons/chevron-up.svg"
          alt="Chevron"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[6rem] -translate-y-4 bg-midnight-200/70 border-midnight-100 backdrop-blur-md grid grid-cols-4 gap-1 p-1">
        {colors.map((color) => (
          <DropdownMenuItem
            key={color.name}
            onSelect={(e) => e.preventDefault()}
            onClick={() => setFillColor(color.hash)}
            className={cn(
              "w-full h-7 rounded-md border flex items-center justify-center",
              color.class,
            )}
          >
            {currentFill === color.hash && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
