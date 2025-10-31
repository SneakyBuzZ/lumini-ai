import { ShapeType } from "@/lib/types/canvas-type";
import { getCursorCoords, isPointInsideShape } from "@/lib/canvas/utils";
import useCanvasStore from "@/lib/store/canvas-store";
import { useState } from "react";
import { createShape, createTextShape } from "@/lib/canvas/crud";

type EditingText = {
  id: string;
  x: number;
  y: number;
  value: string;
  height: number;
  width: number;
  fontSize: number;
  fontFamily?: string;
} | null;

export const useDrawing = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  //* --- Store & State ---
  const store = useCanvasStore();
  const [editingText, setEditingText] = useState<EditingText>(null);

  //* --- Mouse Down Handler ---
  const onMouseDown = (e: React.MouseEvent, currentTool?: ShapeType | null) => {
    if (!canvasRef.current) return;
    if (store.mode !== "draw" || !currentTool || !store.shapeType) return;

    const { x, y } = getCursorCoords(
      canvasRef.current,
      e,
      store.scale,
      store.offsetX,
      store.offsetY
    );

    const shape = createShape(currentTool, x, y);
    store.drawing.start(shape, x, y);
  };

  //* --- Mouse Move Handler ---
  const onMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    if (store.mode !== "draw" || !store.drawingInProgress) return;

    const { x, y } = getCursorCoords(
      canvasRef.current,
      e,
      store.scale,
      store.offsetX,
      store.offsetY
    );

    //* --- Shift for proportional shapes ---
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

  //* --- Mouse Up Handler ---
  const onMouseUp = () => {
    if (store.mode !== "draw" || !store.drawingInProgress) return;
    store.drawing.finish();

    //* --- Select the newly drawn shape ---
    const tempId = store.tempShapeId;
    if (tempId) {
      store.selection.addId(tempId);
      store.selection.setMode("select");
      store.setShapeType(null);
    }

    store.historyActions.push();
  };

  //* --- Double Click Handler for Text ---
  const onDoubleClick = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const { x, y } = getCursorCoords(
      canvasRef.current,
      e,
      store.scale,
      store.offsetX,
      store.offsetY
    );

    //* --- Check if clicking on existing text shape ---
    const shape = Object.values(store.shapes)
      .slice()
      .reverse()
      .find((s) => isPointInsideShape(s, x, y));

    if (shape) {
      setEditingText({
        id: shape.id,
        x: shape.x + shape.width / 2,
        y: shape.y + shape.height / 2,
        value: shape.text ?? "",
        fontSize: shape.fontSize ?? 16,
        fontFamily: shape.fontFamily ?? "sans-serif",
        height: shape.height,
        width: shape.width,
      });
    } else {
      const defaultWidth = 150;
      const defaultHeight = 40;

      const textShape = createTextShape(x, y);

      store.drawing.start(textShape, x, y);

      setEditingText({
        id: textShape.id,
        x: textShape.x,
        y: textShape.y,
        value: "",
        fontSize: 16,
        fontFamily: "sans-serif",
        width: defaultWidth,
        height: defaultHeight,
      });
    }
  };

  const onTextChange = (value: string) => {
    setEditingText((prev) => (prev ? { ...prev, value } : null));
  };

  const onTextBlur = () => {
    if (!editingText) return;

    store.shapesActions.update({
      ...store.shapes[editingText.id],
      text: editingText.value,
    });

    setEditingText(null);
  };

  //* --- Wheel Handler for Zooming ---
  const onWheel = (e: React.WheelEvent) => {
    if (!canvasRef.current) return;

    e.preventDefault();

    const MIN_ZOOM = 0.1; // 10%
    const MAX_ZOOM = 2; // 200%

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

    store.view.setScale(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, newScale)));
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
    onTextChange,
    onTextBlur,
  };
};
