import { useState, useCallback, useRef } from "react";
import useCanvasStore from "@/lib/store/canvas-store";
import { getCursorCoords, isPointInsideShape } from "@/lib/canvas/utils";
import { CanvasShape } from "@/lib/types/canvas-type";

export const useSelect = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const store = useCanvasStore();

  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const initialShapePositionsRef = useRef<
    Record<string, { x: number; y: number }>
  >({});
  const altDragRef = useRef<{ originalId: string; copyId: string } | null>(
    null,
  );
  const didDragRef = useRef(false);

  const [selectionBoxStart, setSelectionBoxStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectionBoxEnd, setSelectionBoxEnd] = useState<{
    x: number;
    y: number;
  } | null>(null);

  /** --- Mouse down --- */
  const onMouseDown = (e: React.MouseEvent) => {
    didDragRef.current = false;
    if (e.button !== 0) return;
    if (!canvasRef.current || store.mode !== "select") return;

    const { x, y } = getCursorCoords(
      canvasRef.current,
      e as unknown as MouseEvent,
      store.scale,
      store.offsetX,
      store.offsetY,
    );

    if (e.altKey && store.mode === "select") {
      const clickedShape = Object.values(store.shapes)
        .reverse()
        .find((s) => isPointInsideShape(s, x, y));

      if (!clickedShape) return;

      const copyId = crypto.randomUUID();
      const copyShape: CanvasShape = {
        ...clickedShape,
        id: copyId,
        isSelected: true,
        isDragging: true,
      };

      store.shapesActions.add(copyShape);
      altDragRef.current = { originalId: clickedShape.id, copyId };

      store.selection.clear();
      store.selection.addId(copyId);
      return;
    }

    const allShapes = Object.values(store.shapes);
    const shape = allShapes
      .slice()
      .reverse()
      .find((s) => isPointInsideShape(s, x, y));

    const selectedShapes = allShapes.filter((s) => s.isSelected);
    let draggingShapeIds: string[] = [];

    const groupBox =
      selectedShapes.length > 0
        ? {
            x: Math.min(...selectedShapes.map((s) => s.x)),
            y: Math.min(...selectedShapes.map((s) => s.y)),
            width:
              Math.max(...selectedShapes.map((s) => s.x + s.width)) -
              Math.min(...selectedShapes.map((s) => s.x)),
            height:
              Math.max(...selectedShapes.map((s) => s.y + s.height)) -
              Math.min(...selectedShapes.map((s) => s.y)),
          }
        : null;

    const isInsideGroupBox =
      groupBox &&
      x >= groupBox.x &&
      x <= groupBox.x + groupBox.width &&
      y >= groupBox.y &&
      y <= groupBox.y + groupBox.height;

    if (shape) {
      const isAlreadySelected = selectedShapes.some((s) => s.id === shape.id);

      if (!isAlreadySelected || !e.shiftKey) {
        // Select shape exclusively
        store.selection.clear();
        allShapes.forEach((s) =>
          store.shapesActions.update({
            ...s,
            isSelected: s.id === shape.id,
          }),
        );
        store.selection.addId(shape.id);
        draggingShapeIds = [shape.id];
      } else if (e.shiftKey) {
        // Toggle select
        if (isAlreadySelected) {
          store.selection.removeId(shape.id);
          store.shapesActions.update({
            ...shape,
            isSelected: false,
          });
          draggingShapeIds = selectedShapes
            .map((s) => s.id)
            .filter((id) => id !== shape.id);
        } else {
          store.selection.addId(shape.id);
          store.shapesActions.update({
            ...shape,
            isSelected: true,
          });
          draggingShapeIds = [...selectedShapes.map((s) => s.id), shape.id];
        }
      }

      // Begin dragging
      dragStartRef.current = { x, y };
      initialShapePositionsRef.current = {};
      draggingShapeIds.forEach((id) => {
        const s = store.shapes[id];
        if (s) initialShapePositionsRef.current[id] = { x: s.x, y: s.y };
      });
    } else if (isInsideGroupBox) {
      dragStartRef.current = { x, y };
      initialShapePositionsRef.current = {};
      store.selectedShapeIds.forEach((id) => {
        const s = store.shapes[id];
        if (s) initialShapePositionsRef.current[id] = { x: s.x, y: s.y };
      });
    } else {
      // Clicking empty space → start rectangle selection
      allShapes.forEach((s) =>
        store.shapesActions.update({
          ...s,
          isSelected: false,
        }),
      );
      store.selection.clear();
      setSelectionBoxStart({ x, y });
      setSelectionBoxEnd({ x, y });
    }
  };

  /** --- Mouse move --- */
  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const { x, y } = getCursorCoords(
        canvasRef.current,
        e as unknown as MouseEvent,
        store.scale,
        store.offsetX,
        store.offsetY,
      );

      if (altDragRef.current) {
        const copy = store.shapes[altDragRef.current.copyId];
        if (!copy) return;

        store.shapesActions.update({
          ...copy,
          x: x - copy.width / 2,
          y: y - copy.height / 2,
        });
        return;
      }

      // Dragging shapes
      if (dragStartRef.current) {
        const dx = x - dragStartRef.current.x;
        const dy = y - dragStartRef.current.y;

        if (!didDragRef.current && (Math.abs(dx) > 2 || Math.abs(dy) > 2)) {
          didDragRef.current = true;
        }

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

      // Selection box
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

          const ix = Math.max(0, Math.min(ex, x2) - Math.max(sx, x1));
          const iy = Math.max(0, Math.min(ey, y2) - Math.max(sy, y1));
          const intersectionArea = ix * iy;
          const shapeArea = Math.abs(s.width * s.height);

          if (intersectionArea > 0 && intersectionArea / shapeArea >= 0.2) {
            selectedIds.push(s.id);
            store.shapesActions.update({
              ...s,
              isSelected: true,
            });
          } else {
            store.shapesActions.update({
              ...s,
              isSelected: false,
            });
          }
        });
        store.selection.select(selectedIds);
      }
    },
    [canvasRef, selectionBoxStart, store],
  );

  /** --- Mouse up --- */
  const onMouseUp = useCallback(() => {
    if (altDragRef.current) {
      const copy = store.shapes[altDragRef.current.copyId];
      if (copy) {
        store.shapesActions.update({
          ...copy,
          isDragging: false,
        });
        store.shapesActions.commitShape(copy.id, "new");
      }
      altDragRef.current = null;
      return;
    }

    if (dragStartRef.current && didDragRef.current) {
      store.selectedShapeIds.forEach((id) => {
        store.shapesActions.commitShape(id, "updated");
      });
    }

    dragStartRef.current = null;
    initialShapePositionsRef.current = {};
    setSelectionBoxStart(null);
    setSelectionBoxEnd(null);
  }, [store]);

  /** --- Draw selection box --- */
  const drawSelectionBox = (
    ctx: CanvasRenderingContext2D,
    scale: number,
    offsetX: number,
    offsetY: number,
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
    ctx.lineWidth = 0.5 / scale;
    ctx.strokeRect(x, y, width, height);
    ctx.setLineDash([]);
    ctx.restore();
  };

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    drawSelectionBox,
  };
};
