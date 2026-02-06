import useCanvasStore from "@/lib/store/canvas-store";
import { useRef, useCallback, useEffect } from "react";
import { useDrawing } from "@/hooks/interaction/use-drawing";
import { useSelect } from "@/hooks/interaction/use-select";
import { usePanZoom } from "@/hooks/interaction/use-panzoom";
import { useResize } from "@/hooks/interaction/use-resize";
import { useUndoRedo } from "@/hooks/interaction/use-undo-redo";

export const useCanvas = (ws: WebSocket | null) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const store = useCanvasStore();

  const drawingHandlers = useDrawing(canvasRef);
  const selectHandlers = useSelect(canvasRef, ws);
  const resizeHandlers = useResize(canvasRef, ws);
  const panZoomHandlers = usePanZoom(canvasRef);
  useUndoRedo();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "x") {
        e.preventDefault();
        const selectedShapes = Object.values(store.shapes).filter((shape) =>
          store.selectedShapeIds.includes(shape.id),
        );
        if (selectedShapes.length > 0) {
          store.shapesActions.batchDelete(selectedShapes);
          store.historyActions.push();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [store]);

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
    [store, drawingHandlers, selectHandlers, resizeHandlers, panZoomHandlers],
  );

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
    [drawingHandlers, selectHandlers, resizeHandlers, panZoomHandlers],
  );

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
    onTextChange: drawingHandlers.onTextChange,
    onTextBlur: drawingHandlers.onTextBlur,
  };
};
