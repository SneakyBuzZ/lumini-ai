import { getLocation } from "@/lib/canvas/utils";
import useCanvasStore from "@/lib/store/canvas.store";
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
  } = useCanvasStore();

  const handleMouseDown = (e: React.MouseEvent) => {
    if (doubleClickLock || currentShape === "text" || editingText) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getLocation(e, canvas);
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
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawingInProgress || editingText) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
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

  const handleMouseUp = () => {
    if (!drawingInProgress || !tempShapeId || doubleClickLock) return;
    finishDrawing();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    setDoubleClickLock(true);
    setTimeout(() => setDoubleClickLock(false), 100);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getLocation(e, canvas);

    setEditingText({ x, y, value: "" });
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleDoubleClick,
    handleMouseUp,
    canvasRef,
    setEditingText,
    editingText,
    shiftPressed,
  };
};

export default UseCanvas;
