import { useEffect, useRef } from "react";
import useCanvasStore from "@/lib/store/canvas-store";

export const usePanZoom = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const store = useCanvasStore();
  const isDragging = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // --- PAN ---
  const onMouseDown = (e: React.MouseEvent) => {
    // Only middle mouse button or pan mode
    if (e.button !== 1 && store.mode !== "pan") return;
    e.preventDefault(); // prevent auto-scroll

    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };

    const canvas = canvasRef.current;
    if (canvas) canvas.style.cursor = "grabbing";
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !lastPos.current) return;

      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;

      store.view.setOffset(store.offsetX + dx, store.offsetY + dy);
      lastPos.current = { x: e.clientX, y: e.clientY };

      if (canvas) canvas.style.cursor = "grabbing";
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        lastPos.current = null;
        const canvas = canvasRef.current;
        if (canvas) canvas.style.cursor = "grab";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [store, canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const isCtrlPressed = isMac ? e.metaKey : e.ctrlKey;
      if (!isCtrlPressed) return;

      e.preventDefault(); // this now works because passive: false
      e.stopPropagation();

      const { scale, offsetX, offsetY, view } = store;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = 1.1;
      const newScale = e.deltaY < 0 ? scale * zoomFactor : scale / zoomFactor;
      const clampedScale = Math.min(Math.max(newScale, 0.2), 5);

      const dx = mouseX - offsetX;
      const dy = mouseY - offsetY;
      const newOffsetX = mouseX - (dx * clampedScale) / scale;
      const newOffsetY = mouseY - (dy * clampedScale) / scale;

      view.setScale(clampedScale);
      view.setOffset(newOffsetX, newOffsetY);
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });

    return () => canvas.removeEventListener("wheel", handleWheel);
  }, [canvasRef, store]);

  // --- ZOOM ---
  const onWheel = (e: React.WheelEvent, canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    e.preventDefault();

    const zoomIntensity = 0.001;
    const delta = -e.deltaY * zoomIntensity;
    const newScale = Math.min(Math.max(store.scale + delta, 0.2), 5);

    // Zoom around mouse pointer
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - store.offsetX) / store.scale;
    const mouseY = (e.clientY - rect.top - store.offsetY) / store.scale;

    const newOffsetX = e.clientX - rect.left - mouseX * newScale;
    const newOffsetY = e.clientY - rect.top - mouseY * newScale;

    store.view.setScale(newScale);
    store.view.setOffset(newOffsetX, newOffsetY);
  };

  return { onMouseDown, onWheel };
};
