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
import { computeZoomToFit } from "@/lib/canvas/view";
import { ResetViewButton } from "./reset-view-button";
import { usePresence } from "@/hooks/use-presence";
import { PresenceBar } from "./presence-bar";
import { usePresenceProfiles } from "@/hooks/use-presence-profiles";
import { useGetUser } from "@/lib/api/queries/user-queries";
import { useSocket } from "@/hooks/use-socket";
import { useCursorBroadcast } from "@/hooks/use-cursor-broadcast";
import { RemoteCursors } from "./remote-cursors";
import useRemoteCursors from "@/hooks/use-remote-cursors";

interface CanvasProps {
  snapshot: GetSnapshot;
}

export function Canvas({ snapshot }: CanvasProps) {
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

  const { id: labId } = Route.useParams();
  const textareaRef = useRef<HTMLInputElement>(null);
  const didAutoFitRef = useRef(false);

  useCanvasPersistence(labId);
  useCanvasViewPersistence(labId);

  const wsRef = useSocket(labId);
  const ws = wsRef.current;
  const remoteCursors = useRemoteCursors(ws);
  useCursorBroadcast(editingText ? null : ws, canvasRef, {
    scale: store.scale,
    offsetX: store.offsetX,
    offsetY: store.offsetY,
  });
  const presenceUsers = usePresence(wsRef);
  const userProfiles = usePresenceProfiles(presenceUsers);
  const { data: userProfile } = useGetUser();

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
    if (didAutoFitRef.current) return;

    let cancelled = false;
    const activeLab = labId;

    (async () => {
      const view = await getView(activeLab);
      if (activeLab !== labId || cancelled) return;

      //saved view wins
      if (view) {
        hydrateView(view);
        didAutoFitRef.current = true;
        return;
      }

      //no saved view, auto-fit
      const canvas = canvasRef.current;
      const shapesArray = Object.values(store.shapes);
      if (!canvas || shapesArray.length === 0) return;

      const rect = canvas.getBoundingClientRect();
      const fit = computeZoomToFit(shapesArray, rect.width, rect.height);

      hydrateView(fit);
      didAutoFitRef.current = true;
    })();

    return () => {
      cancelled = true;
    };
  }, [labId, hasHydrated, hydrateView, store.shapes, canvasRef]);

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

        <RemoteCursors
          cursors={remoteCursors}
          users={userProfiles}
          transform={{ scale, offsetX, offsetY }}
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
        <div className="absolute bottom-4 right-4 flex justify-center items-center gap-1.5 p-1.5 bg-midnight-200/70 h-14 border rounded-full">
          <ResetViewButton />
          <ZoomDropdown scale={scale} />
        </div>
        <div className="absolute bottom-4 left-4 flex justify-center items-center gap-1.5 p-1.5 bg-midnight-200/70 h-14 rounded-full border border-neutral-800/60">
          <span className="h-11 px-3 text-sm flex justify-center items-center gap-2 rounded-full bg-neutral-800/50 border border-neutral-800/60">
            Online
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </span>
          <PresenceBar users={userProfiles} user={userProfile ?? null} />
        </div>
      </div>
    </>
  );
}
