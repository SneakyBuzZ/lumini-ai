import { useState, useEffect, useCallback, useRef } from "react";
import useCanvasStore from "@/lib/store/canvas-store";
import { getCanvasCoords, isPointInsideShape } from "@/lib/canvas/utils";

export const useSelect = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const store = useCanvasStore();

  // --- Refs for drag logic (fast, no re-render) ---
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const initialShapePositionsRef = useRef<
    Record<string, { x: number; y: number }>
  >({});

  // --- UI state (safe to re-render) ---
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
    if (!canvasRef.current || store.mode !== "select") return;

    const { x, y } = getCanvasCoords(
      canvasRef.current,
      e as unknown as MouseEvent,
      store.scale,
      store.offsetX,
      store.offsetY
    );

    const allShapes = Object.values(store.shapes);
    const shape = allShapes
      .slice()
      .reverse()
      .find((s) => isPointInsideShape(s, x, y));

    const selectedShapes = allShapes.filter((s) => s.isSelected);

    // Helper → compute bounding box for selected shapes
    const getGroupBoundingBox = () => {
      if (selectedShapes.length === 0) return null;
      const minX = Math.min(...selectedShapes.map((s) => s.x));
      const minY = Math.min(...selectedShapes.map((s) => s.y));
      const maxX = Math.max(...selectedShapes.map((s) => s.x + s.width));
      const maxY = Math.max(...selectedShapes.map((s) => s.y + s.height));
      return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
    };

    const groupBox = getGroupBoundingBox();

    const isInsideGroupBox =
      groupBox &&
      x >= groupBox.x &&
      x <= groupBox.x + groupBox.width &&
      y >= groupBox.y &&
      y <= groupBox.y + groupBox.height;

    if (shape) {
      // --- Clicked on a shape ---
      const isAlreadySelected = store.selectedShapeIds.includes(shape.id);

      if (!isAlreadySelected && !e.shiftKey) {
        // Clear old and select this
        store.selection.clear();
        allShapes.forEach((s) =>
          store.shapesActions.update({
            ...s,
            isSelected: s.id === shape.id,
            strokeColor: s.id === shape.id ? "#a8a8a8ff" : "#3d3d3d",
          })
        );
        store.selection.addId(shape.id);
      } else if (e.shiftKey) {
        // Toggle selection on shift-click
        if (isAlreadySelected) {
          store.selection.removeId(shape.id);
          store.shapesActions.update({
            ...shape,
            isSelected: false,
            strokeColor: "#3d3d3d",
          });
        } else {
          store.selection.addId(shape.id);
          store.shapesActions.update({
            ...shape,
            isSelected: true,
            strokeColor: "#a8a8a8ff",
          });
        }
      }

      // prepare for dragging (single or multiple)
      dragStartRef.current = { x, y };
      initialShapePositionsRef.current = {};
      store.selectedShapeIds.forEach((id) => {
        const s = store.shapes[id];
        if (s) initialShapePositionsRef.current[id] = { x: s.x, y: s.y };
      });
    } else if (isInsideGroupBox) {
      // --- Clicked inside group bounding box (no shape directly clicked) ---
      dragStartRef.current = { x, y };
      initialShapePositionsRef.current = {};
      store.selectedShapeIds.forEach((id) => {
        const s = store.shapes[id];
        if (s) initialShapePositionsRef.current[id] = { x: s.x, y: s.y };
      });
    } else {
      // --- Clicked empty space: start selection box ---
      allShapes.forEach((s) =>
        store.shapesActions.update({
          ...s,
          isSelected: false,
          strokeColor: "#3d3d3d",
        })
      );
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

      // --- DRAGGING SELECTED SHAPES ---
      if (dragStartRef.current && store.selectedShapeIds?.length) {
        const dx = x - dragStartRef.current.x;
        const dy = y - dragStartRef.current.y;

        store.selectedShapeIds.forEach((id) => {
          const shape = store.shapes[id];
          const initial = initialShapePositionsRef.current[id];
          if (!shape || !initial) return;

          store.shapesActions.update({
            ...shape,
            x: initial.x + dx,
            y: initial.y + dy,
          });
        });

        return;
      }

      // --- SELECTION BOX LOGIC ---
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

          // Intersection area with selection box
          const ix = Math.max(0, Math.min(ex, x2) - Math.max(sx, x1));
          const iy = Math.max(0, Math.min(ey, y2) - Math.max(sy, y1));
          const intersectionArea = ix * iy;
          const shapeArea = s.width * s.height;

          if (intersectionArea / shapeArea >= 0.8) {
            selectedIds.push(s.id);
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
    [canvasRef, selectionBoxStart, store]
  );

  // --- Mouse up ---
  const onMouseUp = useCallback(() => {
    dragStartRef.current = null;
    initialShapePositionsRef.current = {};
    setSelectionBoxStart(null);
    setSelectionBoxEnd(null);
  }, []);

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

  // --- Register global listeners ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      canvas.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp, canvasRef]);

  return { onMouseDown, drawSelectionBox };
};
