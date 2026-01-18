import { useEffect, useCallback, useRef } from "react";
import { renderShapes } from "@/lib/canvas/drawing";
import { initialiseCanvas } from "@/lib/canvas/utils";
import { useCanvas } from "@/hooks/use-canvas";
import ZoomDropdown from "./zoom-dropdown";
import { GetSnapshot } from "@/lib/api/dto";
import useCanvasPersistence from "@/hooks/use-canvas-persistence";
import { Route } from "@/routes/dashboard/lab/$id/canvas";
import { getView } from "@/lib/api/lab-api";
import useCanvasStore from "@/lib/store/canvas-store";
import { useCanvasViewPersistence } from "@/hooks/use-canvas-view-persistence";

interface CanvasProps {
  snapshot: GetSnapshot;
}

export function Canvas({ snapshot }: CanvasProps) {
  const { id: labId } = Route.useParams();
  const textareaRef = useRef<HTMLInputElement>(null);

  useCanvasPersistence(labId);
  useCanvasViewPersistence(labId);

  const {
    canvasRef,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onDoubleClick,
    store,
    editingText,
    drawSelectionBox,
    drawResizeHandles,
    onTextChange,
    onTextBlur,
  } = useCanvas();

  const { data } = snapshot;
  const { shapes, scale, offsetX, offsetY, mode, cursor } = store;

  const hydrateCanvas = useCanvasStore((s) => s.hydrateCanvas);
  const hydrateView = useCanvasStore((s) => s.view.hydrateView);
  const hasHydrated = useCanvasStore((s) => s.hasHydrated);

  // --- hydrate shapes ---
  useEffect(() => {
    if (hasHydrated) return;
    if (!data?.shapes) return;

    hydrateCanvas(data);
  }, [data, hasHydrated, hydrateCanvas]);

  // --- hydrate view ---
  useEffect(() => {
    if (!hasHydrated) return;

    let cancelled = false;
    const activeLab = labId;
    (async () => {
      const view = await getView(activeLab);
      if (!view || cancelled || activeLab !== labId) return;

      hydrateView(view);
    })();

    return () => {
      cancelled = true;
    };
  }, [labId, hasHydrated, hydrateView]);

  // --- redraw with proper cursor ---
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    initialiseCanvas(ctx, canvas);

    renderShapes(shapes, ctx, { scale, offsetX, offsetY }, editingText);

    if (mode === "select") {
      drawSelectionBox(ctx, scale, offsetX, offsetY);
    }

    drawResizeHandles(ctx, scale, offsetX, offsetY);

    if (mode === "draw") {
      canvas.style.cursor = "crosshair";
    } else if (mode === "select") {
      canvas.style.cursor = cursor || "default";
    }
  }, [
    canvasRef,
    shapes,
    scale,
    offsetX,
    offsetY,
    mode,
    cursor,
    drawSelectionBox,
    drawResizeHandles,
    editingText,
  ]);

  // --- redraw on relevant changes ---
  useEffect(() => {
    redraw();
  }, [shapes, scale, offsetX, offsetY, redraw]);

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

  useEffect(() => {
    if (textareaRef.current) {
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [editingText]);

  return (
    <>
      <div className="relative w-full h-full">
        <canvas
          ref={canvasRef}
          tabIndex={0}
          className="w-full h-full z-0"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onDoubleClick={onDoubleClick}
        />
        {editingText && (
          <div
            style={{
              position: "absolute",
              left:
                editingText.x * scale +
                offsetX -
                (editingText.width * scale) / 2,
              top:
                editingText.y * scale +
                offsetY -
                (editingText.height * scale) / 2,
              width: editingText.width * scale,
              height: editingText.height * scale,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            <input
              type="text"
              ref={textareaRef}
              autoFocus
              style={{
                fontSize: `${editingText.fontSize * scale}px`,
                fontFamily: editingText.fontFamily,
                textAlign: "center",
                background: "#66666600",
                color: "#ebebeb",
                border: "none",
                outline: "none",
                resize: "none",
                zIndex: 10,
                padding: 0,
                lineHeight: "normal",
                pointerEvents: "all",
                width: "fit-content",
                minHeight: "9px", // minimum height
                height: "auto", // grow as content grows
              }}
              className="bg-midnight-400 border-none outline-none resize-none hide-scrollbar"
              value={editingText.value}
              onChange={(e) => {
                const textarea = e.target;
                onTextChange(e.target.value);

                // Auto-grow logic
                textarea.style.height = "auto"; // reset height to recalc
                textarea.style.height =
                  Math.max(textarea.scrollHeight, 16) + "px";
              }}
              onBlur={onTextBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  (e.target as HTMLTextAreaElement).blur();
                }
              }}
            />
          </div>
        )}
        <ZoomDropdown scale={scale} />
      </div>
    </>
  );
}
