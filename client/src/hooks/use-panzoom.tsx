import { useEffect, useRef } from "react";
import useCanvasStore from "@/lib/store/canvas-store";

export const usePanZoom = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const store = useCanvasStore();
  const isDragging = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const onMouseDown = (e: React.MouseEvent) => {
    if (store.mode !== "pan") return;
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const onWheel = (e: React.WheelEvent, canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;

    e.preventDefault();

    const scaleAmount = -e.deltaY * 0.001;
    const newScale = Math.min(Math.max(store.scale + scaleAmount, 0.2), 5);

    // Zoom around mouse pointer
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - store.offsetX) / store.scale;
    const mouseY = (e.clientY - rect.top - store.offsetY) / store.scale;

    store.view.setScale(newScale);
    store.view.setOffset(
      e.clientX - rect.left - mouseX * newScale,
      e.clientY - rect.top - mouseY * newScale
    );
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
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      lastPos.current = null;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [canvasRef, store]);

  return { onMouseDown, onWheel };
};
