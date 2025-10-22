export interface Shape {
  id: string;
  type: ShapeType;

  // Base geometry
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;

  // Style
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
  opacity?: number;

  // Text-specific
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: "normal" | "bold";
  textAlign?: "left" | "center" | "right";

  // Interaction state (UI only, not persisted ideally)
  isSelected?: boolean;
  isDragging?: boolean;
  isHovered?: boolean;
  isLocked?: boolean;
  isHidden?: boolean;
}

export type ShapeType =
  | "rectangle"
  | "ellipse"
  | "line"
  | "arrow"
  | "text"
  | "image";

export type DrawOptions = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

export type CanvasMode = "draw" | "select" | "pan" | "text";

export type CanvasCusor =
  | "default"
  | "grab"
  | "grabbing"
  | "crosshair"
  | "pointer"
  | "nwse-resize"
  | "nesw-resize"
  | "ns-resize"
  | "ew-resize"
  | "text";
