import { useEffect, useRef } from "react";
import useCanvasStore from "@/lib/store/canvas-store";

export const usePanZoom = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const store = useCanvasStore();
  const isDragging = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // --- PAN ---
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 1 && store.mode !== "pan") return;
    e.preventDefault();

    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e: MouseEvent | React.MouseEvent) => {
    if (!isDragging.current || !lastPos.current) return;

    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;

    store.view.setOffset(store.offsetX + dx, store.offsetY + dy);
    lastPos.current = { x: e.clientX, y: e.clientY };

    store.view.setCursor("grabbing");
  };

  const onMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    lastPos.current = null;

    store.view.setCursor("default");
  };

  // --- ZOOM: use native wheel listener to support preventDefault ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const isCtrlPressed = isMac ? e.metaKey : e.ctrlKey;
      if (!isCtrlPressed) return;

      e.preventDefault(); // works because passive: false
      e.stopPropagation();

      const { scale, offsetX, offsetY, view } = store;

      const MIN_ZOOM = 0.1; // 10%
      const MAX_ZOOM = 2; // 200%

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Increment/decrement in 10% steps
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      let newScale = scale + delta;

      newScale = Math.min(Math.max(newScale, MIN_ZOOM), MAX_ZOOM);

      const dx = mouseX - offsetX;
      const dy = mouseY - offsetY;
      const newOffsetX = mouseX - (dx * newScale) / scale;
      const newOffsetY = mouseY - (dy * newScale) / scale;

      view.setScale(newScale);
      view.setOffset(newOffsetX, newOffsetY);
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, [canvasRef, store]);

  return { onMouseDown, onMouseMove, onMouseUp };
};
