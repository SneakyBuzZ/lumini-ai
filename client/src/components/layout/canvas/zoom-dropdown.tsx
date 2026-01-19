import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useCanvasStore from "@/lib/store/canvas-store";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { Minus, Plus } from "lucide-react";

interface TextSizeDropdownProps {
  scale: number;
}

export default function ZoomDropdown({ scale = 100 }: TextSizeDropdownProps) {
  const { view } = useCanvasStore();
  const zoomPercent = Math.round(scale * 100);
  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 2;

  const handleIncrementZoom = () => {
    const newScale = scale + 0.1;
    view.setScale(Math.min(newScale, MAX_ZOOM));
  };

  const handleDecrementZoom = () => {
    const newScale = scale - 0.1;
    view.setScale(Math.max(newScale, MIN_ZOOM));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-8 p-1 px-2 flex items-center justify-center gap-2 bg-midnight-100 hover:bg-neutral-800/70 border border-neutral-800 rounded-lg">
        <span className="text-white text-[14px]">{zoomPercent}%</span>
        <img
          className="w-[5.5px] h-[5.5px] rotate-180"
          src={"/assets/icons/chevron-up.svg"}
          alt={"Chevron Up"}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[6rem] bg-midnight-200/70 border-midnight-100 backdrop-blur-md"
      >
        <DropdownMenuLabel className="flex items-center justify-start w-full p-1">
          <button
            onClick={handleIncrementZoom}
            className="w-6 h-6 bg-midnight-100 flex justify-center items-center p-1 rounded-md"
          >
            <Plus />
          </button>
          <span className="w-full text-md text-center">{zoomPercent}%</span>
          <button
            onClick={handleDecrementZoom}
            className="w-6 h-6 bg-midnight-100 flex justify-center items-center p-1 rounded-md"
          >
            <Minus />
          </button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-midnight-100" />
        {[50, 100, 200].map((z) => (
          <DropdownMenuItem key={z} onClick={() => view.setScale(z / 100)}>
            {z}%
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
