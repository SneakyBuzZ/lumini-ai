import { ShapeType, Shape } from "@/lib/types/canvas-type";
import { getCanvasCoords, isPointInsideShape } from "@/lib/canvas/utils";
import useCanvasStore from "@/lib/store/canvas-store";
import { useState } from "react";

export const useDrawing = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const store = useCanvasStore();
  const [editingText, setEditingText] = useState<{
    id: string;
    x: number;
    y: number;
    value: string;
    fontSize?: number;
    fontFamily?: string;
  } | null>(null);

  const onMouseDown = (e: React.MouseEvent, currentTool?: ShapeType | null) => {
    if (!canvasRef.current) return;
    if (store.mode !== "draw" || !currentTool || !store.shapeType) return;

    const { x, y } = getCanvasCoords(
      canvasRef.current,
      e,
      store.scale,
      store.offsetX,
      store.offsetY
    );

    const shape: Shape = {
      id: crypto.randomUUID(),
      type: currentTool,
      x,
      y,
      width: 0,
      height: 0,
      strokeWidth: 0.5,
      isSelected: false,
      isDragging: false,
      isHovered: false,
      text: currentTool === "text" ? "" : undefined,
    };
    store.drawing.start(shape, x, y);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    if (store.mode !== "draw" || !store.drawingInProgress) return;

    const { x, y } = getCanvasCoords(
      canvasRef.current,
      e,
      store.scale,
      store.offsetX,
      store.offsetY
    );

    if (e.shiftKey) {
      const deltaX = x - store.startX;
      const deltaY = y - store.startY;
      const size = Math.max(Math.abs(deltaX), Math.abs(deltaY));
      const width = deltaX < 0 ? -size : size;
      const height = deltaY < 0 ? -size : size;
      store.drawing.updateTemp(width, height);
      return;
    }

    const width = x - store.startX;
    const height = y - store.startY;
    store.drawing.updateTemp(width, height);
  };

  const onMouseUp = () => {
    if (store.mode !== "draw" || !store.drawingInProgress) return;
    store.drawing.finish();

    const tempId = store.tempShapeId;
    if (tempId) {
      store.selection.addId(tempId);
      store.selection.setMode("select");
      store.setShapeType(null);
    }
  };

  const onDoubleClick = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const { x, y } = getCanvasCoords(
      canvasRef.current,
      e,
      store.scale,
      store.offsetX,
      store.offsetY
    );

    // Check if double-clicked an existing text shape
    const shape = Object.values(store.shapes)
      .slice()
      .reverse()
      .find((s) => s.type === "text" && isPointInsideShape(s, x, y));

    if (shape) {
      setEditingText({
        id: shape.id,
        x: shape.x,
        y: shape.y,
        value: shape.text ?? "",
        fontSize: 16,
        fontFamily: "sans-serif",
      });
    } else {
      const newShape: Shape = {
        id: crypto.randomUUID(),
        type: "text",
        x,
        y,
        width: 0,
        height: 0,
        strokeWidth: 0.5,
        isSelected: true,
        isDragging: false,
        isHovered: false,
        text: "",
      };

      store.drawing.start(newShape, x, y);

      setEditingText({
        id: newShape.id,
        x: newShape.x,
        y: newShape.y,
        value: "",
        fontSize: 16,
        fontFamily: "sans-serif",
      });
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    if (!canvasRef.current) return;

    e.preventDefault();

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const scaleFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newScale = store.scale * scaleFactor;

    // Zoom around mouse pointer
    const offsetX =
      mouseX - ((mouseX - store.offsetX) / store.scale) * newScale;
    const offsetY =
      mouseY - ((mouseY - store.offsetY) / store.scale) * newScale;

    store.view.setScale(newScale);
    store.view.setOffset(offsetX, offsetY);
  };

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onDoubleClick,
    onWheel,
    editingText,
    setEditingText,
  };
};
