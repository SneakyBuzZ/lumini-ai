import { useEffect, useCallback } from "react";
import { renderShapes } from "@/lib/canvas/drawing";
import { initialiseCanvas } from "@/lib/canvas/utils";
import { useCanvas } from "@/hooks/use-canvas";

export function Canvas() {
  const {
    canvasRef,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onDoubleClick,
    store,
    editingText,
    setEditingText,
    drawSelectionBox,
    drawResizeHandles,
  } = useCanvas();

  const { shapes, scale, offsetX, offsetY, mode } = store;

  // --- redraw with proper cursor ---
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    initialiseCanvas(ctx, canvas);

    // draw shapes
    renderShapes(shapes, ctx, { scale, offsetX, offsetY });

    // draw selection box
    if (mode === "select") drawSelectionBox(ctx, scale, offsetX, offsetY);
    drawResizeHandles(ctx, scale, offsetX, offsetY);

    if (store.mode === "draw") {
      canvas.style.cursor = "crosshair";
    } else if (store.mode === "select") {
      canvas.style.cursor = store.cursor || "default";
    }
  }, [
    canvasRef,
    shapes,
    scale,
    offsetX,
    offsetY,
    mode,
    drawSelectionBox,
    drawResizeHandles,
    store.cursor,
    store.mode,
  ]);

  // --- resize canvas ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
      }
      redraw();
    };

    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(parent);
    resizeCanvas();

    return () => observer.disconnect();
  }, [canvasRef, redraw]);

  return (
    <>
      <canvas
        ref={canvasRef}
        tabIndex={0}
        className="w-full h-full"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onDoubleClick={onDoubleClick}
      />
      {editingText && (
        <textarea
          autoFocus
          style={{
            position: "absolute",
            left: editingText.x * scale + offsetX,
            top: editingText.y * scale + offsetY,
            fontSize: `${editingText.fontSize ?? 16}px`,
            fontFamily: editingText.fontFamily ?? "sans-serif",
            zIndex: 10,
            background: "transparent",
            color: "#fff",
          }}
          className="bg-midnight-400 text-white border-none outline-none resize-none"
          value={editingText.value}
          onChange={(e) =>
            setEditingText({ ...editingText, value: e.target.value })
          }
          onBlur={() => setEditingText(null)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              (e.target as HTMLTextAreaElement).blur();
            }
          }}
        />
      )}
    </>
  );
}
