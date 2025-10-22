import { useState, useEffect, useCallback, useRef } from "react";
import useCanvasStore from "@/lib/store/canvas-store";
import { getCanvasCoords, isPointInsideShape } from "@/lib/canvas/utils";

export const useSelect = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const store = useCanvasStore();

  // --- Fast refs ---
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const initialShapePositionsRef = useRef<
    Record<string, { x: number; y: number }>
  >({});

  // --- UI state ---
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
    if (e.button === 1) return;
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
    let draggingShapeIds: string[] = [];

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
      const isAlreadySelected = selectedShapes.some((s) => s.id === shape.id);

      if (!isAlreadySelected || !e.shiftKey) {
        // Clear old selection and select this shape
        store.selection.clear();
        allShapes.forEach((s) =>
          store.shapesActions.update({
            ...s,
            isSelected: s.id === shape.id,
            strokeColor: s.id === shape.id ? "#fff" : "#a0a0a0",
          })
        );
        store.selection.addId(shape.id);

        // **Use this shape for drag immediately**
        draggingShapeIds = [shape.id];
      } else if (e.shiftKey) {
        // Toggle selection
        if (isAlreadySelected) {
          store.selection.removeId(shape.id);
          store.shapesActions.update({
            ...shape,
            isSelected: false,
            strokeColor: "#a0a0a0",
          });
          draggingShapeIds = selectedShapes
            .map((s) => s.id)
            .filter((id) => id !== shape.id);
        } else {
          store.selection.addId(shape.id);
          store.shapesActions.update({
            ...shape,
            isSelected: true,
            strokeColor: "#fff",
          });
          draggingShapeIds = [...selectedShapes.map((s) => s.id), shape.id];
        }
      }
    } else if (isInsideGroupBox) {
      // Clicked inside the group selection box (drag multi-select)
      dragStartRef.current = { x, y };
      initialShapePositionsRef.current = {};
      store.selectedShapeIds.forEach((id) => {
        const s = store.shapes[id];
        if (s) initialShapePositionsRef.current[id] = { x: s.x, y: s.y };
      });
    } else {
      // Clicked empty space: prepare selection box
      allShapes.forEach((s) =>
        store.shapesActions.update({
          ...s,
          isSelected: false,
          strokeColor: "#a0a0a0",
        })
      );
      store.selection.clear();
      setSelectionBoxStart({ x, y });
      setSelectionBoxEnd({ x, y });
    }

    // --- Initialize drag for **any shapes we want to drag immediately** ---
    if (draggingShapeIds.length) {
      dragStartRef.current = { x, y };
      initialShapePositionsRef.current = {};
      draggingShapeIds.forEach((id) => {
        const s = store.shapes[id];
        if (s) initialShapePositionsRef.current[id] = { x: s.x, y: s.y };
      });
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

      // Dragging shapes
      if (dragStartRef.current) {
        if (!dragStartRef.current) return;
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

      // Rectangle selection
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
          const shapeArea = Math.abs(s.width * s.height);
          if (intersectionArea > 0 && intersectionArea / shapeArea >= 0.2) {
            selectedIds.push(s.id);
            store.shapesActions.update({
              ...s,
              isSelected: true,
              strokeColor: "#fff",
            });
          } else {
            store.shapesActions.update({
              ...s,
              isSelected: false,
              strokeColor: "#a0a0a0",
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
  const drawSelectionBox = (
    ctx: CanvasRenderingContext2D,
    scale: number,
    offsetX: number,
    offsetY: number
  ) => {
    if (!selectionBoxStart || !selectionBoxEnd) return;

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
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
    ctx.restore();
  };

  // --- Register global listeners (mousemove/up) ---
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
