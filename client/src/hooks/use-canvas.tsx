import { getCanvasCoords, isPointInsideShape } from "@/lib/canvas/utils";
import useCanvasStore from "@/lib/store/canvas-store";
import { Shape } from "@/lib/types/canvas.type";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";

const UseCanvas = () => {
  const [editingText, setEditingText] = useState<{
    x: number;
    y: number;
    value: string;
  } | null>(null);

  const [shiftPressed, setShiftPressed] = useState(false);

  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") setShiftPressed(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") setShiftPressed(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    startDrawing,
    updateTempShape,
    finishDrawing,
    drawingInProgress,
    startX,
    startY,
    currentShape,
    tempShapeId,
    setDoubleClickLock,
    doubleClickLock,
    scale,
    offsetX,
    offsetY,
  } = useCanvasStore();

  const handleMouseDown = (e: React.MouseEvent) => {
    console.log("mousedown", e.button);
    if (e.button === 1) {
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY };
      if (canvasRef.current) {
        canvasRef.current.style.cursor = "grabbing";
      }
      e.preventDefault();
      return;
    }

    if (doubleClickLock || currentShape === "text" || editingText) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getCanvasCoords(e, canvas, scale, offsetX, offsetY);
    const id = nanoid(6);

    const newShape: Shape = {
      id,
      type: currentShape,
      x,
      y,
      width: 0,
      height: 0,
      color: "#4a4a4a",
    };

    startDrawing(newShape, x, y);

    const shapes = useCanvasStore.getState().shapes;

    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i];
      if (isPointInsideShape(shape, x, y)) {
        useCanvasStore.getState().selectShape(shape.id);
        return;
      }
    }

    useCanvasStore.getState().selectShape(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning && panStart.current) {
      const { offsetX, offsetY, setOffset } = useCanvasStore.getState();
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;

      setOffset(offsetX + dx, offsetY + dy);

      panStart.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
      return;
    }

    if (!drawingInProgress || editingText) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getCanvasCoords(e, canvas, scale, offsetX, offsetY);

    let width = x - startX;
    let height = y - startY;

    if (shiftPressed) {
      if (currentShape === "rectangle" || currentShape === "ellipse") {
        // Make square/circle: use the smaller of width/height, preserving sign
        const size = Math.min(Math.abs(width), Math.abs(height));
        width = width < 0 ? -size : size;
        height = height < 0 ? -size : size;
      }
      if (currentShape === "line" || currentShape === "arrow") {
        // Constrain to horizontal, vertical, or 45-degree
        const absWidth = Math.abs(width);
        const absHeight = Math.abs(height);
        if (absWidth > absHeight * 2) {
          // Horizontal
          height = 0;
        } else if (absHeight > absWidth * 2) {
          // Vertical
          width = 0;
        } else {
          // 45-degree
          const signW = width < 0 ? -1 : 1;
          const signH = height < 0 ? -1 : 1;
          const size = Math.max(absWidth, absHeight);
          width = signW * size;
          height = signH * size;
        }
      }
    }

    updateTempShape(width, height);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) {
      setIsPanning(false);
      panStart.current = null;
      if (canvasRef.current) {
        canvasRef.current.style.cursor = "default";
      }
      e.preventDefault();
      return;
    }
    if (!drawingInProgress || !tempShapeId || doubleClickLock) return;
    finishDrawing();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    setDoubleClickLock(true);
    setTimeout(() => setDoubleClickLock(false), 100);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getCanvasCoords(e, canvas, scale, offsetX, offsetY);

    setEditingText({ x, y, value: "" });
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const isCtrlPressed = isMac ? e.metaKey : e.ctrlKey;

    if (isCtrlPressed) {
      e.preventDefault();

      const { scale, offsetX, offsetY, setScale, setOffset } =
        useCanvasStore.getState();

      const canvas = e.currentTarget;
      const rect = canvas.getBoundingClientRect();

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = 1.1;
      const newScale = e.deltaY < 0 ? scale * zoomFactor : scale / zoomFactor;

      const minScale = 0.2;
      const maxScale = 5;
      const clampedScale = Math.min(Math.max(newScale, minScale), maxScale);

      const dx = mouseX - offsetX;
      const dy = mouseY - offsetY;

      const newOffsetX = mouseX - (dx * clampedScale) / scale;
      const newOffsetY = mouseY - (dy * clampedScale) / scale;

      setScale(clampedScale);
      setOffset(newOffsetX, newOffsetY);
    }
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleDoubleClick,
    handleMouseUp,
    handleWheel,
    canvasRef,
    setEditingText,
    editingText,
    shiftPressed,
  };
};

export default UseCanvas;
