import { useState, useCallback, useRef } from "react";
import useCanvasStore from "@/lib/store/canvas-store";
import { getCursorCoords, isPointInsideShape } from "@/lib/canvas/utils";
import { Actions, CanvasShape, State } from "@/lib/types/canvas-type";

export const useSelect = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  ws: WebSocket | null,
) => {
  // Store
  const store = useCanvasStore();

  // Ref for whether a selection change occurred
  const didSelectionRef = useRef(false);

  // Refs for dragging shapes
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  // Refs for initial positions of shapes being dragged
  const initialShapePositionsRef = useRef<
    Record<string, { x: number; y: number }>
  >({});

  // Ref for shape duplication via Alt+Drag
  const toBeDuplicateShapeRef = useRef<{
    originalId: string;
    copyId: string;
  } | null>(null);

  // Ref for whether a drag action occurred
  const didDragRef = useRef(false);

  // State for selection box start
  const [selectionBoxStart, setSelectionBoxStart] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // State for selection box end
  const [selectionBoxEnd, setSelectionBoxEnd] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Broadcast selection over WebSocket
  const broadcastSelection = useCallback(() => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    ws.send(
      JSON.stringify({
        type: "selection:update",
        shapeIds: store.selectedShapeIds,
      }),
    );
  }, [ws, store.selectedShapeIds]);

  //& ----- Mouse down ------
  const onMouseDown = (e: React.MouseEvent) => {
    didDragRef.current = false;
    didSelectionRef.current = false;

    // Only respond to left-click
    if (e.button !== 0) return;
    if (!canvasRef.current || store.mode !== "select") return;

    const { x, y } = getCursorCoords(
      canvasRef.current,
      e as unknown as MouseEvent,
      store,
    );

    const clickedShape = Object.values(store.shapes).find((s) =>
      isPointInsideShape(s, x, y),
    );
    const selectedIds = store.selectedShapeIds;
    const isMultiSelect = e.shiftKey;

    // --- ALT : Duplicate Shape --- //
    if (e.altKey && clickedShape) {
      handleAltKeyDown(store, clickedShape);
      startDragging([clickedShape.id], x, y);
      didSelectionRef.current = true;
      return;
    }

    // --- CLICK ON SHAPE --- //
    if (clickedShape) {
      // Compute which shapes should be selected to be dragged or for selection
      const nextSelectedIds = computeNextSelection(
        selectedIds,
        clickedShape.id,
        isMultiSelect,
      );
      store.selection.select(nextSelectedIds);
      didSelectionRef.current = true;
      startDragging(nextSelectedIds, x, y);
      return;
    }

    // --- CLICK INSIDE GROUP BOX --- //
    if (getIsInsideGroupBox(store, x, y)) {
      startDragging(selectedIds, x, y);
      return;
    }

    // --- CLICK ON EMPTY CANVAS --- //
    store.selection.clear();
    didSelectionRef.current = true;
    dragStartRef.current = null;
    setSelectionBoxStart({ x, y });
  };

  //& ----- Mouse move ------
  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      //* ----- Mouse-move handlers ------
      /**
       * Begins the Alt+Drag duplication process for a shape.
       * @param   x - The current x-coordinate of the mouse.
       * @param   y - The current y-coordinate of the mouse.
       * @returns void
       */
      const handleAltKeyMove = (x: number, y: number) => {
        const dup = toBeDuplicateShapeRef.current;
        if (!dup) return;

        const { copyId, originalId } = dup;
        const original = store.shapes[originalId];
        if (!original) return;

        store.shapesActions.add({
          ...original,
          id: copyId,
          isSelected: true,
          isDragging: true,
        });

        store.shapesActions.update({
          ...original,
          isSelected: false,
        });

        store.selection.clear();
        store.selection.addId(copyId);

        initialShapePositionsRef.current = {
          [copyId]: { x: original.x, y: original.y },
        };

        dragStartRef.current = { x, y };
        didDragRef.current = true;
      };

      /**  * Handles dragging of selected shapes.
       * @param   x - The current x-coordinate of the mouse.
       * @param   y - The current y-coordinate of the mouse.
       * @returns void
       */
      const handleDragMove = (x: number, y: number) => {
        if (!dragStartRef.current) return;
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
      };

      /**  * Handles movement of the selection box.
       * @param   x - The current x-coordinate of the mouse.
       * @param   y - The current y-coordinate of the mouse.
       * @returns void
       */
      const handleSelectMove = (x: number, y: number) => {
        if (!selectionBoxStart) return;

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

          const intersectionRatio = (ix * iy) / Math.abs(s.width * s.height);

          const isSelected = intersectionRatio >= 0.2;

          store.shapesActions.update({
            ...s,
            isSelected,
          });

          if (isSelected) selectedIds.push(s.id);
        });

        store.selection.select(selectedIds);
        didSelectionRef.current = true;
      };

      if (!canvasRef.current) return;
      const { x, y } = getCursorCoords(
        canvasRef.current,
        e as unknown as MouseEvent,
        store,
      );

      // Alt + Drag to duplicate shape
      if (
        toBeDuplicateShapeRef.current &&
        e.altKey &&
        dragStartRef.current &&
        !didDragRef.current
      ) {
        handleAltKeyMove(x, y);
        return;
      }

      // Dragging shapes
      if (dragStartRef.current) {
        handleDragMove(x, y);
        return;
      }

      // Selection box
      if (selectionBoxStart) {
        handleSelectMove(x, y);
      }
    },
    [
      canvasRef,
      selectionBoxStart,
      store,
      toBeDuplicateShapeRef,
      dragStartRef,
      didDragRef,
    ],
  );

  //& ----- Mouse up ------
  const onMouseUp = useCallback(() => {
    //* ----- Mouse-up handlers ------
    /**
     * Handles Alt key release to finalize shape duplication.
     * @returns void
     */
    const handleAltKeyUp = () => {
      const dup = toBeDuplicateShapeRef.current;
      if (!dup) return;

      const copy = store.shapes[dup.copyId];
      if (!copy) return;

      store.shapesActions.update({
        ...copy,
        isDragging: false,
        isSelected: true,
      });

      store.shapesActions.commitShape(copy.id, "new");
      toBeDuplicateShapeRef.current = null;
    };

    /**  * Handles the end of a drag operation.
     * @returns void
     */
    const handleDragUp = () => {
      if (!dragStartRef.current || !didDragRef.current) return;

      store.selectedShapeIds.forEach((id) => {
        store.shapesActions.commitShape(id, "updated");
      });

      broadcastSelection();
      didSelectionRef.current = false;
    };

    handleAltKeyUp();
    handleDragUp();
    resetInteractionState();

    // Broadcast selection if it changed
    if (didSelectionRef.current) {
      broadcastSelection();
      didSelectionRef.current = false;
    }
  }, [store, broadcastSelection]);

  //* ----- Mouse-down handlers ------
  /**
   * Handles Alt+Click to duplicate a shape
   *
   * @param   store - The canvas store containing state and actions.
   * @param   clickedShape - The shape that was clicked.
   * @returns void
   */
  const handleAltKeyDown = (
    store: State & Actions,
    clickedShape: CanvasShape,
  ) => {
    store.selection.clear();
    store.selection.addId(clickedShape.id);
    store.shapesActions.update({
      ...clickedShape,
      isSelected: true,
    });
    toBeDuplicateShapeRef.current = {
      originalId: clickedShape.id,
      copyId: crypto.randomUUID(),
    };
  };

  //* Utility functions for use-select hook
  /**
   * Gets whether the (x, y) coordinates are inside the bounding box of the currently selected group of shapes.
   * @param store - The canvas store containing state and actions.
   * @param x - X coordinate to check.
   * @param y - Y coordinate to check.
   * @returns - boolean // True if (x, y) is inside the group bounding box, false otherwise.
   */
  const getIsInsideGroupBox = (
    store: State & Actions,
    x: number,
    y: number,
  ) => {
    const selectedShapes = store.selectedShapeIds
      .map((id) => store.shapes[id])
      .filter(Boolean);
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

    return isInsideGroupBox;
  };

  /**
   * Sets up dragging for the given shape IDs starting from (x, y).
   * @param ids - Array of shape IDs to be dragged.
   * @param x - Starting X coordinate.
   * @param y - Starting Y coordinate.
   */
  const startDragging = (ids: string[], x: number, y: number) => {
    dragStartRef.current = { x, y };
    initialShapePositionsRef.current = {};

    ids.forEach((id) => {
      const s = store.shapes[id];
      if (s) {
        initialShapePositionsRef.current[id] = { x: s.x, y: s.y };
      }
    });
  };

  /**
   * Draws the selection box on the canvas.
   * @param ctx - Canvas rendering context.
   * @param scale -
   * @param offsetX
   * @param offsetY
   * @returns
   */
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

    // fillstyle white with 50 opacity
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.setLineDash([5, 3]);
    ctx.lineWidth = 0.5 / scale;
    ctx.strokeRect(x, y, width, height);
    ctx.setLineDash([]);
    ctx.restore();
  };

  /** * Computes the next selection based on current selection, clicked shape, and multi-select flag.
   * @param selectedIds - Currently selected shape IDs.
   * @param clickedId - ID of the shape that was clicked.
   * @param isMultiSelect - Whether multi-select (Shift key) is active.
   * @returns - New array of selected shape IDs.
   */
  const computeNextSelection = (
    selectedIds: string[],
    clickedId: string,
    isMultiSelect: boolean,
  ) => {
    if (!isMultiSelect) return [clickedId];

    return selectedIds.includes(clickedId)
      ? selectedIds.filter((id) => id !== clickedId)
      : [...selectedIds, clickedId];
  };

  /** * Resets the interaction state.
   */
  const resetInteractionState = () => {
    dragStartRef.current = null;
    initialShapePositionsRef.current = {};
    setSelectionBoxStart(null);
    setSelectionBoxEnd(null);
  };

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    drawSelectionBox,
  };
};
