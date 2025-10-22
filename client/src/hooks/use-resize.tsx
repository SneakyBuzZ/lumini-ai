/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useCallback } from "react";
import useCanvasStore from "@/lib/store/canvas-store";
import { getCanvasCoords } from "@/lib/canvas/utils";
import { CanvasCusor, Shape } from "@/lib/types/canvas-type";

type HandleName = "tl" | "tr" | "br" | "bl" | "t" | "b" | "l" | "r";

export const useResize = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const store = useCanvasStore();

  const resizingRef = useRef<{
    handle: HandleName;
    initialBox: { x: number; y: number; width: number; height: number };
    initialShapes: Record<
      string,
      { x: number; y: number; width: number; height: number }
    >;
  } | null>(null);

  /** --- Check if currently resizing --- */
  const isResizing = () => !!resizingRef.current;

  /** --- Compute bounding box of selected shapes --- */
  const getSelectionBox = useCallback(() => {
    const selected = Object.values(store.shapes).filter((s) => s.isSelected);
    if (!selected.length) return null;
    const minX = Math.min(...selected.map((s) => s.x));
    const minY = Math.min(...selected.map((s) => s.y));
    const maxX = Math.max(...selected.map((s) => s.x + s.width));
    const maxY = Math.max(...selected.map((s) => s.y + s.height));
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }, [store.shapes]);

  /** --- Detect handle at point --- */
  const getHandleAtPoint = useCallback(
    (x: number, y: number) => {
      const box = getSelectionBox();
      if (!box) return null;

      const handleOffset = 5;
      const edgeTolerance = 12;
      const size = 8;

      const handles: Record<HandleName, { x: number; y: number }> = {
        // corners
        tl: { x: box.x - handleOffset, y: box.y - handleOffset },
        tr: { x: box.x + box.width + handleOffset, y: box.y - handleOffset },
        br: {
          x: box.x + box.width + handleOffset,
          y: box.y + box.height + handleOffset,
        },
        bl: { x: box.x - handleOffset, y: box.y + box.height + handleOffset },

        // edges
        t: { x: box.x + box.width / 2, y: box.y - handleOffset },
        b: { x: box.x + box.width / 2, y: box.y + box.height + handleOffset },
        l: { x: box.x - handleOffset, y: box.y + box.height / 2 },
        r: { x: box.x + box.width + handleOffset, y: box.y + box.height / 2 },
      };

      for (const [name, h] of Object.entries(handles) as [HandleName, any][]) {
        if (["tl", "tr", "br", "bl"].includes(name)) {
          if (
            x >= h.x - size / 2 &&
            x <= h.x + size / 2 &&
            y >= h.y - size / 2 &&
            y <= h.y + size / 2
          )
            return name;
        }
      }

      if (
        y >= box.y - edgeTolerance &&
        y <= box.y + edgeTolerance &&
        x > box.x + handleOffset &&
        x < box.x + box.width - handleOffset
      )
        return "t";

      if (
        y >= box.y + box.height - edgeTolerance &&
        y <= box.y + box.height + edgeTolerance &&
        x > box.x + handleOffset &&
        x < box.x + box.width - handleOffset
      )
        return "b";

      if (
        x >= box.x - edgeTolerance &&
        x <= box.x + edgeTolerance &&
        y > box.y + handleOffset &&
        y < box.y + box.height - handleOffset
      )
        return "l";

      if (
        x >= box.x + box.width - edgeTolerance &&
        x <= box.x + box.width + edgeTolerance &&
        y > box.y + handleOffset &&
        y < box.y + box.height - handleOffset
      )
        return "r";

      return null;
    },
    [getSelectionBox]
  );

  /** --- Mouse down --- */
  const onMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current || store.mode !== "select") return;

    const { x, y } = getCanvasCoords(
      canvasRef.current,
      e as unknown as MouseEvent,
      store.scale,
      store.offsetX,
      store.offsetY
    );
    const handle = getHandleAtPoint(x, y);
    if (!handle) return;

    const selectionBox = getSelectionBox();
    if (!selectionBox) return;

    const selectedIds = store.selectedShapeIds;
    const initialShapes: Record<string, any> = {};
    selectedIds.forEach((id) => {
      const s = store.shapes[id];
      if (s) initialShapes[id] = { ...s };
    });

    resizingRef.current = {
      handle,
      initialBox: { ...selectionBox },
      initialShapes,
    };
  };

  /** --- Mouse move --- */
  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const { x, y } = getCanvasCoords(
        canvas,
        e as unknown as MouseEvent,
        store.scale,
        store.offsetX,
        store.offsetY
      );

      // --- CURSOR HANDLING ---
      let cursor: CanvasCusor = "default";

      if (resizingRef.current) {
        // If actively resizing, use the active handle for cursor
        const activeHandle = resizingRef.current.handle;
        if (["tl", "br"].includes(activeHandle)) cursor = "nwse-resize";
        else if (["tr", "bl"].includes(activeHandle)) cursor = "nesw-resize";
        else if (["t", "b"].includes(activeHandle)) cursor = "ns-resize";
        else if (["l", "r"].includes(activeHandle)) cursor = "ew-resize";
      } else {
        // Otherwise, check if hovering over any handle or edge
        const hoveredHandle = getHandleAtPoint(x, y);
        if (hoveredHandle) {
          if (["tl", "br"].includes(hoveredHandle)) cursor = "nwse-resize";
          else if (["tr", "bl"].includes(hoveredHandle)) cursor = "nesw-resize";
          else if (["t", "b"].includes(hoveredHandle)) cursor = "ns-resize";
          else if (["l", "r"].includes(hoveredHandle)) cursor = "ew-resize";
        }
      }

      store.view.setCursor(cursor);

      if (!resizingRef.current) return;

      const { handle, initialBox, initialShapes } = resizingRef.current;

      // --- RESIZE LOGIC ---
      let newX = initialBox.x;
      let newY = initialBox.y;
      let newW = initialBox.width;
      let newH = initialBox.height;

      switch (handle) {
        // --- Corners ---
        case "tl":
          newW = initialBox.x + initialBox.width - x;
          newH = initialBox.y + initialBox.height - y;
          newX = x;
          newY = y;
          break;
        case "tr":
          newW = x - initialBox.x;
          newH = initialBox.y + initialBox.height - y;
          newY = y;
          break;
        case "br":
          newW = x - initialBox.x;
          newH = y - initialBox.y;
          break;
        case "bl":
          newW = initialBox.x + initialBox.width - x;
          newH = y - initialBox.y;
          newX = x;
          break;

        // --- Edges ---
        case "t":
          newH = initialBox.y + initialBox.height - y;
          newY = y;
          break;
        case "b":
          newH = y - initialBox.y;
          break;
        case "l":
          newW = initialBox.x + initialBox.width - x;
          newX = x;
          break;
        case "r":
          newW = x - initialBox.x;
          break;
      }

      if (e.shiftKey) {
        const aspect = initialBox.width / initialBox.height;
        if (newW / newH > aspect) newW = newH * aspect;
        else newH = newW / aspect;

        if (handle === "tl") {
          newX = initialBox.x + initialBox.width - newW;
          newY = initialBox.y + initialBox.height - newH;
        } else if (handle === "tr")
          newY = initialBox.y + initialBox.height - newH;
        else if (handle === "bl") newX = initialBox.x + initialBox.width - newW;
      }

      if (newW < 10 || newH < 10) return;

      const scaleX = newW / initialBox.width;
      const scaleY = newH / initialBox.height;

      const updates: Record<string, Partial<Shape>> = {};
      Object.entries(initialShapes).forEach(([id, shape]) => {
        const relX = shape.x - initialBox.x;
        const relY = shape.y - initialBox.y;
        updates[id] = {
          x: newX + relX * scaleX,
          y: newY + relY * scaleY,
          width: shape.width * scaleX,
          height: shape.height * scaleY,
        };
      });

      store.shapesActions.batchUpdate(updates);
    },
    [canvasRef, store, getHandleAtPoint]
  );

  /** --- Mouse up --- */
  const onMouseUp = useCallback(() => {
    resizingRef.current = null;
  }, []);

  /** --- Draw resize handles --- */
  const drawResizeHandles = (
    ctx: CanvasRenderingContext2D,
    scale: number,
    offsetX: number,
    offsetY: number
  ) => {
    const box = getSelectionBox();
    if (!box) return;

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    const size = 6;
    const handleOffset = 5;
    const handles = [
      { x: box.x - handleOffset, y: box.y - handleOffset }, // tl
      { x: box.x + box.width + handleOffset, y: box.y - handleOffset }, // tr
      {
        x: box.x + box.width + handleOffset,
        y: box.y + box.height + handleOffset,
      }, // br
      { x: box.x - handleOffset, y: box.y + box.height + handleOffset }, // bl
    ];

    ctx.fillStyle = "#bdbdbd";
    handles.forEach((h) =>
      ctx.fillRect(h.x - size / 2, h.y - size / 2, size, size)
    );
    ctx.restore();
  };

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    drawResizeHandles,
    isResizing,
    getHandleAtPoint,
  };
};
