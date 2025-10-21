import { useEffect, useCallback } from "react";
import { renderShapes } from "@/lib/canvas/drawing";
import { initialiseCanvas } from "@/lib/canvas/utils";
import { DrawOptions } from "@/lib/types/canvas-type";
import { useCanvas } from "@/hooks/use-canvas";

const cursorMap: Record<string, string> = {
  draw: "crosshair",
  select: "default",
  pan: "grab",
  text: "text",
};

export function Canvas() {
  const {
    canvasRef,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onDoubleClick,
    onWheel,
    store,
    editingText,
    setEditingText,
    drawSelectionBox,
  } = useCanvas();

  const { shapes, scale, offsetX, offsetY } = store;

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cursor = cursorMap[store.mode] ?? "default";
    canvas.style.cursor = cursor;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    initialiseCanvas(ctx, canvas);

    const drawingOptions: DrawOptions = { scale, offsetX, offsetY };
    renderShapes(shapes, ctx, drawingOptions);

    if (store.mode === "select") {
      drawSelectionBox(ctx);
    }
  }, [
    canvasRef,
    shapes,
    scale,
    offsetX,
    offsetY,
    drawSelectionBox,
    store.mode,
  ]);

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
  }, [redraw, canvasRef]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="w-full h-full bg-midnight-300 block"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onDoubleClick={onDoubleClick}
        onWheel={(e) => onWheel(e, canvasRef.current)}
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
