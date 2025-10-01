import useCanvasStore from "@/lib/store/canvas-store";
import { useRef } from "react";
import { useDrawing } from "@/hooks/use-drawing";
import { useSelect } from "@/hooks/use-select";
import { usePanZoom } from "@/hooks/use-panzoom";

export const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const store = useCanvasStore();

  const drawingHandlers = useDrawing(canvasRef);
  const selectionHandlers = useSelect(canvasRef);
  const panZoomHandlers = usePanZoom(canvasRef);

  const onMouseDown = (e: React.MouseEvent) => {
    drawingHandlers.onMouseDown(e, store.shapeType);
    selectionHandlers.onMouseDown(e);
    panZoomHandlers.onMouseDown(e);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    drawingHandlers.onMouseMove(e);
  };

  const onMouseUp = () => {
    drawingHandlers.onMouseUp();
  };

  return {
    canvasRef,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onDoubleClick: drawingHandlers.onDoubleClick,
    onWheel: panZoomHandlers.onWheel,
    editingText: drawingHandlers.editingText,
    setEditingText: drawingHandlers.setEditingText,
    store,
    drawSelectionBox: selectionHandlers.drawSelectionBox,
  };
};
