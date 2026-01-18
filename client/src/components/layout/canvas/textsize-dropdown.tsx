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
}

export default function TextSizeDropdown({
  selectedShapes,
}: TextSizeDropdownProps) {
  const store = useCanvasStore();
  const [shapes, setShapes] = useState<Record<string, CanvasShape>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState<number>(16);

  useEffect(() => {
    if (selectedShapes.length === 0) return;
    const firstShape = selectedShapes[0];
    setCurrentFontSize(firstShape.fontSize || 16);
  }, [selectedShapes, store.shapes]);

  useEffect(() => {
    const initialShapes = Object.fromEntries(
      selectedShapes.map((shape) => [shape.id, shape])
    );
    setShapes(initialShapes);
  }, [selectedShapes]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      store.shapesActions.clearSelectedShapes();
    }
  };

  const handleSelectFontSize = (size: number) => {
    const updates: Record<string, Partial<CanvasShape>> = {};
    Object.entries(shapes).forEach(([id, shape]) => {
      updates[id] = {
        ...shape,
        fontSize: size,
      };
    });
    store.shapesActions.batchUpdate(updates);
    setCurrentFontSize(size);
  };

  const handleIncrementFontSize = () => {
    const newSize = currentFontSize + 2;
    handleSelectFontSize(newSize);
  };

  const handleDecrementFontSize = () => {
    const newSize = currentFontSize - 2;
    handleSelectFontSize(newSize);
  };

  const getFontSizeLabel = (size: number | null) => {
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
        return "Medium";
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange} open={isOpen}>
      <DropdownMenuTrigger className="w-24 h-10 flex items-center justify-center gap-2 hover:bg-midnight-100 border-0 rounded-lg">
        <span className="text-sm tracking-normal text-white">
          {getFontSizeLabel(currentFontSize)}
        </span>
        <img
          className="w-[5.5px] h-[5.5px]"
          src={"/assets/icons/chevron-up.svg"}
          alt={"Chevron Up"}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[6rem] -translate-y-4 bg-midnight-200/70 border-midnight-100 backdrop-blur-md">
        <DropdownMenuLabel className="flex items-center justify-start w-full p-1">
          <button
            onClick={() => handleIncrementFontSize()}
            className="w-6 h-6 bg-midnight-100 flex justify-center items-center p-1 rounded-md"
          >
            <Plus />
          </button>
          <span className="w-full text-md text-center">{currentFontSize}</span>
          <button
            onClick={() => handleDecrementFontSize()}
            className="w-6 h-6 bg-midnight-100 flex justify-center items-center p-1 rounded-md"
          >
            <Minus />
          </button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-midnight-100" />
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          onClick={() => handleSelectFontSize(12)}
          className={cn(
            "flex items-center gap-5 hover:bg-midnight-100/80",
            currentFontSize === 12 && "bg-teal hover:bg-teal"
          )}
        >
          Small
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          onClick={() => handleSelectFontSize(16)}
          className={cn(
            "flex items-center gap-5 hover:bg-midnight-100/80",
            currentFontSize === 16 && "bg-teal hover:bg-teal"
          )}
        >
          Medium
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          onClick={() => handleSelectFontSize(20)}
          className={cn(
            "flex items-center gap-5 hover:bg-midnight-100/80",
            currentFontSize === 20 && "bg-teal hover:bg-teal"
          )}
        >
          Large
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          onClick={() => handleSelectFontSize(24)}
          className={cn(
            "flex items-center gap-5 hover:bg-midnight-100/80",
            currentFontSize === 24 && "bg-teal hover:bg-teal"
          )}
        >
          X-Large
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
