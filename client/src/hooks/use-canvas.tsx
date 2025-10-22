import useCanvasStore from "@/lib/store/canvas-store";
import { useRef, useCallback } from "react";
import { useDrawing } from "@/hooks/use-drawing";
import { useSelect } from "@/hooks/use-select";
import { usePanZoom } from "@/hooks/use-panzoom";
import { useResize } from "./use-resize";

export const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const store = useCanvasStore();

  const drawingHandlers = useDrawing(canvasRef);
  const selectHandlers = useSelect(canvasRef);
  const panZoomHandlers = usePanZoom(canvasRef);
  const resizeHandlers = useResize(canvasRef);

  /** --- Combined mouse down handler --- */
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!canvasRef.current) return;

      // --- Get canvas coords ---
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - store.offsetX) / store.scale;
      const y = (e.clientY - rect.top - store.offsetY) / store.scale;

      // --- Priority: Resize first ---
      const handle = resizeHandlers.getHandleAtPoint?.(x, y);
      if (handle) {
        resizeHandlers.onMouseDown(e);
        return;
      }

      // --- Then drawing ---
      if (store.mode === "draw" && store.shapeType) {
        drawingHandlers.onMouseDown(e, store.shapeType);
        return;
      }

      // --- Then selection / drag ---
      selectHandlers.onMouseDown(e);

      // --- Finally pan (optional) ---
      panZoomHandlers.onMouseDown(e);
    },
    [store, drawingHandlers, selectHandlers, resizeHandlers, panZoomHandlers]
  );

  /** --- Combined mouse move handler --- */
  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      // --- Resize first ---
      resizeHandlers.onMouseMove?.(e as unknown as MouseEvent);

      // --- Then drag / select ---
      selectHandlers.onMouseMove?.(e as unknown as MouseEvent);

      // --- Drawing ---
      drawingHandlers.onMouseMove(e);

      // --- Pan ---
      panZoomHandlers.onMouseMove?.(e);
    },
    [drawingHandlers, selectHandlers, resizeHandlers, panZoomHandlers]
  );

  /** --- Combined mouse up handler --- */
  const onMouseUp = useCallback(() => {
    resizeHandlers.onMouseUp?.();
    selectHandlers.onMouseUp?.();
    drawingHandlers.onMouseUp();
    panZoomHandlers.onMouseUp?.();
  }, [drawingHandlers, selectHandlers, resizeHandlers, panZoomHandlers]);

  return {
    canvasRef,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onDoubleClick: drawingHandlers.onDoubleClick,
    editingText: drawingHandlers.editingText,
    setEditingText: drawingHandlers.setEditingText,
    store,
    drawSelectionBox: selectHandlers.drawSelectionBox,
    drawResizeHandles: resizeHandlers.drawResizeHandles,
  };
};
