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
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface TextSizeDropdownProps {
  selectedShapes: CanvasShape[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TextSizeDropdown({
  selectedShapes,
  open,
  onOpenChange,
}: TextSizeDropdownProps) {
  const store = useCanvasStore();
  const [currentFontSize, setCurrentFontSize] = useState<number>(16);

  // Sync UI state
  useEffect(() => {
    if (selectedShapes.length > 0) {
      setCurrentFontSize(selectedShapes[0].fontSize ?? 16);
    } else {
      setCurrentFontSize(store.toolPreferences.fontSize);
    }
  }, [selectedShapes, store.toolPreferences.fontSize]);

  const applyToSelection = (fontSize: number) => {
    if (selectedShapes.length === 0) return;

    const updates: Record<string, Partial<CanvasShape>> = {};

    selectedShapes.forEach((shape) => {
      updates[shape.id] = { fontSize };
    });

    // 1. Local mutation
    store.shapesActions.batchUpdate(updates);

    // 2. Commit (THIS triggers persistence)
    selectedShapes.forEach((shape) => {
      store.shapesActions.commitShape(shape.id, "updated");
    });
  };

  const setFontSize = (size: number) => {
    // Persist default for new text
    store.toolPreferencesActions.set("fontSize", size);

    // Apply to selected text shapes
    applyToSelection(size);

    setCurrentFontSize(size);
  };

  const increment = () => setFontSize(currentFontSize + 2);
  const decrement = () => setFontSize(Math.max(8, currentFontSize - 2));

  const getFontSizeLabel = (size: number) => {
    switch (size) {
      case 12:
        return "Small";
      case 16:
        return "Medium";
      case 20:
        return "Large";
      case 24:
        return "X-Large";
      default:
        return `${size}px`;
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger className="w-24 h-10 flex items-center justify-center gap-2 hover:bg-midnight-100 rounded-lg">
        <span className="text-sm text-white">
          {getFontSizeLabel(currentFontSize)}
        </span>
        <img
          className="w-[5.5px] h-[5.5px]"
          src="/assets/icons/chevron-up.svg"
          alt="Chevron"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[6rem] -translate-y-4 bg-midnight-200/70 border-midnight-100 backdrop-blur-md">
        <DropdownMenuLabel className="flex items-center gap-2 p-1">
          <button
            onClick={increment}
            className="w-6 h-6 bg-midnight-100 rounded-md flex items-center justify-center"
          >
            <Plus />
          </button>
          <span className="flex-1 text-center">{currentFontSize}</span>
          <button
            onClick={decrement}
            className="w-6 h-6 bg-midnight-100 rounded-md flex items-center justify-center"
          >
            <Minus />
          </button>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-midnight-100" />

        {[12, 16, 20, 24].map((size) => (
          <DropdownMenuItem
            key={size}
            onSelect={(e) => e.preventDefault()}
            onClick={() => setFontSize(size)}
            className={cn(
              "flex items-center gap-5 hover:bg-midnight-100/80",
              currentFontSize === size && "bg-teal hover:bg-teal",
            )}
          >
            {getFontSizeLabel(size)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
