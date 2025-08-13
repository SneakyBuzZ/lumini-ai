export type ShapeType = "rectangle" | "ellipse" | "line" | "arrow" | "text";

export interface Shape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  text?: string;
  isSelected?: boolean;
  isDragging?: boolean;
  isHovered?: boolean;
}
