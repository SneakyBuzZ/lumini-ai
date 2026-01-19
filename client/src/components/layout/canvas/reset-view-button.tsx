import { Button } from "@/components/ui/button";
import useCanvasStore from "@/lib/store/canvas-store";
import { RotateCcw } from "lucide-react";

export function ResetViewButton() {
  const resetView = useCanvasStore((s) => s.view.reset);

  return (
    <Button
      onClick={resetView}
      className="h-11 w-11 flex justify-center items-center rounded-l-full bg-neutral-800/50 hover:bg-neutral-800/70 border border-neutral-800/60 "
    >
      <RotateCcw size={14} className="text-neutral-200" />
    </Button>
  );
}
