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
  {
    name: "Red",
    class: "bg-[#f85757ff] border-[#ff3b3bff]",
    hash: "#fc6b6b50",
  },
  {
    name: "Green",
    class: "bg-[#458645] border-[#1ba01b]",
    hash: "#4586453a",
  },
  {
    name: "Blue",
    class: "bg-[#3f83f8] border-[#3f83f8]",
    hash: "#3f83f828",
  },
  {
    name: "Purple",
    class: "bg-[#8c38ec] border-[#8c38ec]",
    hash: "#8c38ec49",
  },
  {
    name: "Pink",
    class: "bg-[#fdc0ff] border-[#fdc0ff]",
    hash: "#ff708857",
  },
  {
    name: "Orange",
    class: "bg-[#ffa53e] border-[#ffa53e]",
    hash: "#ffa60050",
  },
  {
    name: "None",
    class: "bg-transparent border",
    hash: "#00000000",
  },
];

interface FillDropdownProps {
  selectedShapes: CanvasShape[];
}

export default function FillDropdown({ selectedShapes }: FillDropdownProps) {
  const store = useCanvasStore();
  const [shapes, setShapes] = useState<Record<string, CanvasShape>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [currentFillColor, setCurrentFillColor] = useState<string>("#ffffff00");

  useEffect(() => {
    if (selectedShapes.length === 0) return;
    const firstShape = selectedShapes[0];
    setCurrentFillColor(firstShape.fillColor || "#ffffff00");
  }, [selectedShapes, store.shapes]);

  useEffect(() => {
    const initialShapes = Object.fromEntries(
      selectedShapes.map((shape) => [shape.id, shape]),
    );
    setShapes(initialShapes);
  }, [selectedShapes]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      store.selection.clear();
    }
  };

  const handleFillColorChange = (color: string) => {
    setCurrentFillColor(color);
    Object.values(shapes).forEach((shape) => {
      store.shapesActions.update({ ...shape, fillColor: color });
    });
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange} open={isOpen}>
      <DropdownMenuTrigger className="w-10 h-10 flex items-center justify-center gap-1 hover:bg-midnight-100 border-0 rounded-lg">
        <PaintBucket className="size-4 text-white" />
        <img
          className="w-[5.5px] h-[5.5px]"
          src={"/assets/icons/chevron-up.svg"}
          alt={"Chevron Up"}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[6rem] -translate-y-4 bg-midnight-200/70 border-midnight-100 backdrop-blur-md grid grid-cols-4 gap-1">
        {colors.map((color) => (
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className={cn(
              "w-full h-7 rounded-md border flex justify-center items-center",
              color.class,
            )}
            key={color.name}
            onClick={() => handleFillColorChange(color.hash)}
          >
            {currentFillColor === color.hash && <Check />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
