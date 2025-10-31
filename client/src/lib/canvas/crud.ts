import { Shape, ShapeType } from "@/lib/types/canvas-type";
import { createId } from "@paralleldrive/cuid2";

export const createShape = (currentTool: ShapeType, x: number, y: number) => {
  const shape: Shape = {
    id: createId(),
    type: currentTool,
    x,
    y,
    width: 0,
    height: 0,
    strokeWidth: 0.5,
    strokeType: "solid",
    strokeColor: "#d6d6d6",
    fillColor: "transparent",
    opacity: 1,
    rotation: 0,
    isSelected: false,
    isDragging: false,
    isHovered: false,
    text: currentTool === "text" ? "" : undefined,
  };
  return shape;
};

export const createTextShape = (x: number, y: number) => {
  const shape: Shape = {
    id: createId(),
    type: "text",
    x,
    y,
    width: 0,
    height: 0,
    strokeWidth: 0.5,
    strokeType: "solid",
    strokeColor: "#a0a0a0",
    fillColor: "transparent",
    opacity: 1,
    rotation: 0,
    isSelected: true,
    isDragging: false,
    isHovered: false,
    text: "",
  };

  return shape;
};
