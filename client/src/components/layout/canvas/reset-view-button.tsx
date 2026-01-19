import { Button } from "@/components/ui/button";
import useCanvasStore from "@/lib/store/canvas-store";
import { RotateCcw } from "lucide-react";

export function ResetViewButton() {
  const resetView = useCanvasStore((s) => s.view.reset);

  return (
    <Button
      onClick={resetView}
      className="h-8 w-8 bg-midnight-100 hover:bg-neutral-800/70 border-neutral-800"
    >
      <RotateCcw size={9} />
    </Button>
  );
}
