/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useCallback } from "react";
import useCanvasStore from "@/lib/store/canvas-store";
import { getCursorCoords } from "@/lib/canvas/utils";
import { CanvasCusor, CanvasShape } from "@/lib/types/canvas-type";
import { CURSORS } from "@/lib/canvas/cursor";

type HandleName =
  | "tl"
  | "tr"
  | "br"
  | "bl"
  | "t"
  | "b"
  | "l"
  | "r"
  | "start"
  | "end";

export const useResize = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const store = useCanvasStore();

  const resizingRef = useRef<{
    handle: HandleName;
    initialBox: { x: number; y: number; width: number; height: number };
    initialShapes: Record<string, CanvasShape>;
  } | null>(null);

  /** --- Check if currently resizing --- */
  const isResizing = () => !!resizingRef.current;

  /** --- Compute bounding box of selected shapes --- */
  const getSelectionBox = useCallback(() => {
    const selected = Object.values(store.shapes).filter((s) => s.isSelected);
    if (!selected.length) return null;

    if (
      selected.length === 1 &&
      (selected[0].type === "line" || selected[0].type === "arrow")
    ) {
      const shape = selected[0];
      const x1 = shape.x;
      const y1 = shape.y;
      const x2 = shape.x + shape.width;
      const y2 = shape.y + shape.height;

      const minX = Math.min(x1, x2);
      const minY = Math.min(y1, y2);
      const maxX = Math.max(x1, x2);
      const maxY = Math.max(y1, y2);

      return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
    }

    // For other shapes or multiple selections
    const xs = selected.flatMap((s) => [s.x, s.x + s.width]);
    const ys = selected.flatMap((s) => [s.y, s.y + s.height]);

    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);

    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }, [store.shapes]);

  /** --- Detect handle at point --- */
  const getHandleAtPoint = useCallback(
    (x: number, y: number) => {
      const selected = Object.values(store.shapes).filter((s) => s.isSelected);

      if (
        selected.length === 1 &&
        (selected[0].type === "line" || selected[0].type === "arrow")
      ) {
        const shape = selected[0];
        const points = [
          { name: "start", x: shape.x, y: shape.y },
          {
            name: "end",
            x: shape.x + shape.width,
            y: shape.y + shape.height,
          },
        ];

        const size = 12;
        for (const pt of points) {
          if (
            x >= pt.x - size / 2 &&
            x <= pt.x + size / 2 &&
            y >= pt.y - size / 2 &&
            y <= pt.y + size / 2
          ) {
            return pt.name as HandleName;
          }
        }
        return null;
      }

      const box = getSelectionBox();
      if (!box) return null;

      const handleOffset = 5;
      const edgeTolerance = 12;
      const size = 8;

      const handles: Record<HandleName, { x: number; y: number }> = {
        tl: { x: box.x - handleOffset, y: box.y - handleOffset },
        tr: { x: box.x + box.width + handleOffset, y: box.y - handleOffset },
        br: {
          x: box.x + box.width + handleOffset,
          y: box.y + box.height + handleOffset,
        },
        bl: { x: box.x - handleOffset, y: box.y + box.height + handleOffset },
        t: { x: box.x + box.width / 2, y: box.y - handleOffset },
        b: { x: box.x + box.width / 2, y: box.y + box.height + handleOffset },
        l: { x: box.x - handleOffset, y: box.y + box.height / 2 },
        r: { x: box.x + box.width + handleOffset, y: box.y + box.height / 2 },
        start: { x: -999, y: -999 },
        end: { x: -999, y: -999 },
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
    [getSelectionBox, store.shapes],
  );

  /** --- Mouse down --- */
  const onMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current || store.mode !== "select") return;

    const { x, y } = getCursorCoords(
      canvasRef.current,
      e as unknown as MouseEvent,
      store.scale,
      store.offsetX,
      store.offsetY,
    );

    const handle = getHandleAtPoint(x, y);
    if (!handle) return;

    const selectionBox = getSelectionBox();
    if (!selectionBox) return;

    const selectedIds = store.selectedShapeIds;
    const initialShapes: Record<string, CanvasShape> = {};
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

      const { x, y } = getCursorCoords(
        canvas,
        e as unknown as MouseEvent,
        store.scale,
        store.offsetX,
        store.offsetY,
      );

      let cursor: CanvasCusor = CURSORS.select;
      const selected = Object.values(store.shapes).filter((s) => s.isSelected);
      const isLineOrArrow =
        selected.length === 1 &&
        (selected[0].type === "line" || selected[0].type === "arrow");

      if (resizingRef.current) {
        const h = resizingRef.current.handle;

        if (isLineOrArrow && (h === "start" || h === "end")) {
          cursor = CURSORS.lineEndpoint;
        } else if (["tl", "br"].includes(h)) {
          cursor = CURSORS.resizeNWSE;
        } else if (["tr", "bl"].includes(h)) {
          cursor = CURSORS.resizeNESW;
        } else if (["t", "b"].includes(h)) {
          cursor = CURSORS.resizeNS;
        } else if (["l", "r"].includes(h)) {
          cursor = CURSORS.resizeEW;
        }
      } else {
        const hovered = getHandleAtPoint(x, y);

        if (isLineOrArrow && (hovered === "start" || hovered === "end")) {
          cursor = CURSORS.lineEndpoint;
        } else if (hovered && ["tl", "br"].includes(hovered)) {
          cursor = CURSORS.resizeNWSE;
        } else if (hovered && ["tr", "bl"].includes(hovered)) {
          cursor = CURSORS.resizeNESW;
        } else if (hovered && ["t", "b"].includes(hovered)) {
          cursor = CURSORS.resizeNS;
        } else if (hovered && ["l", "r"].includes(hovered)) {
          cursor = CURSORS.resizeEW;
        }
      }

      store.view.setCursor(cursor);

      if (!resizingRef.current) return;
      const { handle, initialBox, initialShapes } = resizingRef.current;

      let newX = initialBox.x;
      let newY = initialBox.y;
      let newW = initialBox.width;
      let newH = initialBox.height;

      if (isLineOrArrow && (handle === "start" || handle === "end")) {
        const id = store.selectedShapeIds[0];
        const shape = initialShapes[id];
        if (!shape) return;

        let newStartX = shape.x;
        let newStartY = shape.y;
        let newEndX = shape.x + shape.width;
        let newEndY = shape.y + shape.height;

        if (handle === "start") {
          newStartX = x;
          newStartY = y;
        }
        if (handle === "end") {
          newEndX = x;
          newEndY = y;
        }

        store.shapesActions.update({
          ...shape,
          x: newStartX,
          y: newStartY,
          width: newEndX - newStartX,
          height: newEndY - newStartY,
        });
        return;
      }

      switch (handle) {
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

      // Maintain aspect ratio with Shift
      if (e.shiftKey) {
        const aspect = initialBox.width / initialBox.height;
        if (newW / newH > aspect) newW = newH * aspect;
        else newH = newW / aspect;

        if (handle === "tl") {
          newX = initialBox.x + initialBox.width - newW;
          newY = initialBox.y + initialBox.height - newH;
        } else if (handle === "tr") {
          newY = initialBox.y + initialBox.height - newH;
        } else if (handle === "bl") {
          newX = initialBox.x + initialBox.width - newW;
        }
      }

      if (newW < 10 || newH < 10) return;

      const scaleX = newW / initialBox.width;
      const scaleY = newH / initialBox.height;

      const updates: Record<string, Partial<CanvasShape>> = {};
      Object.entries(initialShapes).forEach(([id, shape]) => {
        if (!(shape.type === "line" || shape.type === "arrow")) {
          const relX = shape.x - initialBox.x;
          const relY = shape.y - initialBox.y;
          updates[id] = {
            x: newX + relX * scaleX,
            y: newY + relY * scaleY,
            width: shape.width * scaleX,
            height: shape.height * scaleY,
          };
        }
      });

      if (Object.keys(updates).length > 0) {
        store.shapesActions.batchUpdate(updates);
      }
    },
    [canvasRef, store, getHandleAtPoint],
  );

  /** --- Mouse up --- */
  const onMouseUp = useCallback(() => {
    if (!resizingRef.current) return;

    const ids = store.selectedShapeIds;
    ids.forEach((id) => {
      store.shapesActions.commitShape(id, "updated");
    });

    resizingRef.current = null;
    store.historyActions.push();
  }, [store]);

  /** --- Draw resize handles --- */
  const drawResizeHandles = (
    ctx: CanvasRenderingContext2D,
    scale: number,
    offsetX: number,
    offsetY: number,
  ) => {
    const box = getSelectionBox();
    if (!box) return;

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    ctx.fillStyle = "#bdbdbd";
    const radius = 4 / scale;

    // Single line/arrow: show only 2 endpoint handles
    if (store.selectedShapeIds.length === 1) {
      const shape = store.shapes[store.selectedShapeIds[0]];
      if (shape.type === "line" || shape.type === "arrow") {
        const start = { x: shape.x, y: shape.y };
        const end = {
          x: shape.x + shape.width,
          y: shape.y + shape.height,
        };
        [start, end].forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
        return;
      }
    }

    // Otherwise, 4 handles (rectangle/ellipse/multi-selection)
    const handleOffset = 6;
    const handles = [
      { x: box.x - handleOffset, y: box.y - handleOffset },
      { x: box.x + box.width + handleOffset, y: box.y - handleOffset },
      {
        x: box.x + box.width + handleOffset,
        y: box.y + box.height + handleOffset,
      },
      { x: box.x - handleOffset, y: box.y + box.height + handleOffset },
    ];

    handles.forEach((h) => {
      ctx.beginPath();
      ctx.arc(h.x, h.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
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
