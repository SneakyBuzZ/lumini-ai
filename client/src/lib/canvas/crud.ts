import { CanvasShape } from "@/lib/types/canvas-type";
import { createId } from "@paralleldrive/cuid2";
import { ShapeKind } from "../types/lab-type";

function createBaseShape(type: ShapeKind, x: number, y: number): CanvasShape {
  return {
    // --- Identity ---
    id: createId(),
    type,

    // --- Geometry ---
    x,
    y,
    width: 0,
    height: 0,
    rotation: 0,

    // --- Style ---
    strokeType: "solid",
    strokeColor: "#d6d6d6",
    fillColor: "transparent",
    strokeWidth: 0.5,
    opacity: 1,

    // --- Text ---
    text: type === "text" ? "" : undefined,
    textColor: "#ffff",
    fontSize: 14,
    fontFamily: "Arial",
    fontWeight: "normal",
    textAlign: "center",

    // --- Layering ---
    zIndex: 0,

    // --- Flags (DB required) ---
    isLocked: false,
    isHidden: false,
    isDeleted: false,

    // --- Sync ---
    version: 1,

    // --- UI only ---
    isSelected: false,
    isHovered: false,
    isDragging: false,

    persistStatus: "new",
    commitVersion: 1,
    lastPersistedVersion: 0,
  };
}

export const createShape = (currentTool: ShapeKind, x: number, y: number) => {
  return createBaseShape(currentTool, x, y);
};

export const createTextShape = (x: number, y: number) => {
  const shape = createBaseShape("text", x, y);
  shape.isSelected = true;
  return shape;
};
