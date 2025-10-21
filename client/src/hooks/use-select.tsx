import { useState, useEffect, useCallback } from "react";
import useCanvasStore from "@/lib/store/canvas-store";
import { getCanvasCoords, isPointInsideShape } from "@/lib/canvas/utils";

export const useSelect = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const store = useCanvasStore();

  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(
    null
  );
  const [, setResizing] = useState<boolean>(false);
  const [selectionBoxStart, setSelectionBoxStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectionBoxEnd, setSelectionBoxEnd] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // --- Mouse down ---
  const onMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current || store === null || store.mode !== "select") return;

    const { x, y } = getCanvasCoords(
      canvasRef.current,
      e as unknown as MouseEvent,
      store.scale,
      store.offsetX,
      store.offsetY
    );

    // Check if we clicked on a shape
    const shape = Object.values(store.shapes)
      .slice()
      .reverse()
      .find((s) => isPointInsideShape(s, x, y));

    if (shape !== undefined) {
      // Single-click selection
      store.selection.select([shape.id]);
      store.shapesActions.update({
        ...shape,
        isSelected: true,
        strokeColor: "#a8a8a8ff",
      });
      setDragOffset({ x: x - shape.x, y: y - shape.y });

      // Reset other shapes
      Object.values(store.shapes).forEach((s) => {
        if (s.id !== shape.id) {
          s.isSelected = false;
          s.strokeColor = "#3d3d3d";
        }
      });
      store.selectionBox.finish();
    } else {
      // Object.values(store.shapes).forEach((s) => {
      //   s.isSelected = false;
      //   s.strokeColor = "#3d3d3d";
      // });
      store.selection.clear();

      setSelectionBoxStart({ x, y });
      setSelectionBoxEnd({ x, y });
    }
  };

  // --- Mouse move ---
  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!canvasRef.current) return;

      const { x, y } = getCanvasCoords(
        canvasRef.current,
        e as unknown as MouseEvent,
        store.scale,
        store.offsetX,
        store.offsetY
      );

      // Move selected shape
      if (dragOffset && store.selectedShapeIds?.length) {
        store.selectedShapeIds.forEach((id) => {
          const shape = store.shapes[id];
          if (!shape) return;
          store.shapesActions.update({
            ...shape,
            x: x - dragOffset.x,
            y: y - dragOffset.y,
          });
        });
        return;
      }

      // Update selection box
      if (selectionBoxStart) {
        setSelectionBoxEnd({ x, y });

        const x1 = Math.min(selectionBoxStart.x, x);
        const y1 = Math.min(selectionBoxStart.y, y);
        const x2 = Math.max(selectionBoxStart.x, x);
        const y2 = Math.max(selectionBoxStart.y, y);

        const selectedIds: string[] = [];

        Object.values(store.shapes).forEach((s) => {
          const sx = s.x;
          const sy = s.y;
          const ex = s.x + s.width;
          const ey = s.y + s.height;

          // intersection area with selection box
          const ix = Math.max(0, Math.min(ex, x2) - Math.max(sx, x1));
          const iy = Math.max(0, Math.min(ey, y2) - Math.max(sy, y1));
          const intersectionArea = ix * iy;
          const shapeArea = s.width * s.height;

          if (intersectionArea / shapeArea >= 0.8) {
            selectedIds.push(s.id);

            // visually mark shape as selected
            store.shapesActions.update({
              ...s,
              isSelected: true,
              strokeColor: "#a8a8a8ff",
            });
          } else {
            store.shapesActions.update({
              ...s,
              isSelected: false,
              strokeColor: "#3d3d3d",
            });
          }
        });

        store.selection.select(selectedIds);
      }
    },
    [canvasRef, dragOffset, selectionBoxStart, store]
  );

  // --- Mouse up ---
  const onMouseUp = () => {
    setDragOffset(null);
    setResizing(false);
    setSelectionBoxStart(null);
    setSelectionBoxEnd(null);
  };

  // --- Draw selection box ---
  const drawSelectionBox = (ctx: CanvasRenderingContext2D) => {
    if (!selectionBoxStart || !selectionBoxEnd) return;

    const x = Math.min(selectionBoxStart.x, selectionBoxEnd.x);
    const y = Math.min(selectionBoxStart.y, selectionBoxEnd.y);
    const width = Math.abs(selectionBoxEnd.x - selectionBoxStart.x);
    const height = Math.abs(selectionBoxEnd.y - selectionBoxStart.y);

    ctx.fillStyle = "rgba(0, 120, 215, 0.05)";
    ctx.fillRect(x, y, width, height);

    ctx.strokeStyle = "rgba(0, 120, 215, 1)";
    ctx.setLineDash([5, 3]);
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x, y, width, height);
    ctx.setLineDash([]);
  };

  // --- Register mousemove and mouseup ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      canvas.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, canvasRef]);

  return { onMouseDown, drawSelectionBox };
};
