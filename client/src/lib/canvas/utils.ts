/* eslint-disable @typescript-eslint/no-unused-vars */
import { Actions, CanvasShape, State } from "@/lib/types/canvas-type";
import { DBShape } from "../types/lab-type";

/**
 * Initialize canvas with proper device pixel ratio scaling
 */
export const initialiseCanvas = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
) => {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;

  ctx.scale(dpr, dpr);

  return ctx;
};

/**
 * Get mouse position relative to canvas (unscaled)
 */
export const getLocation = (e: React.MouseEvent, canvas: HTMLCanvasElement) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  return { x, y };
};

/**
 * Get canvas coordinates considering scale and offset
 */
export const getCursorCoords = (
  canvas: HTMLCanvasElement,
  e: MouseEvent | React.MouseEvent,
  store: Actions & State,
) => {
  const { scale, offsetX, offsetY } = store;
  const rect = canvas.getBoundingClientRect();
  const clientX = "clientX" in e ? e.clientX : 0;
  const clientY = "clientY" in e ? e.clientY : 0;

  const x = (clientX - rect.left - offsetX) / scale;
  const y = (clientY - rect.top - offsetY) / scale;

  return { x, y };
};

/**
 * Snap a line to nearest multiple of 0°, 45°, 90°, etc.
 */
export function snapLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  thresholdDeg = 7,
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = Math.atan2(dy, dx);
  const deg = (angle * 180) / Math.PI;

  const snapAngles = [0, 45, 90, 135, 180, -45, -90, -135, -180];

  for (const snap of snapAngles) {
    if (Math.abs(deg - snap) < thresholdDeg) {
      const length = Math.sqrt(dx * dx + dy * dy);
      const rad = (snap * Math.PI) / 180;
      return {
        x2: x1 + Math.cos(rad) * length,
        y2: y1 + Math.sin(rad) * length,
      };
    }
  }

  return { x2, y2 };
}

/**
 * Check if a point (px, py) is inside a shape
 */
export function isPointInsideShape(
  shape: CanvasShape,
  px: number,
  py: number,
): boolean {
  const { x, y, width, height, type } = shape;
  const left = Math.min(x, x + width);
  const right = Math.max(x, x + width);
  const top = Math.min(y, y + height);
  const bottom = Math.max(y, y + height);

  if (type === "rectangle" || type === "text" || type === "ellipse") {
    return px >= left && px <= right && py >= top && py <= bottom;
  }

  if (type === "line" || type === "arrow") {
    const x1 = x;
    const y1 = y;
    const x2 = x + width;
    const y2 = y + height;

    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    const param = lenSq !== 0 ? dot / lenSq : -1;

    let closestX, closestY;
    if (param < 0) {
      closestX = x1;
      closestY = y1;
    } else if (param > 1) {
      closestX = x2;
      closestY = y2;
    } else {
      closestX = x1 + param * C;
      closestY = y1 + param * D;
    }

    const dx = px - closestX;
    const dy = py - closestY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance <= 6; // hit radius
  }

  return false;
}

/**
 * Draw highlight rectangle for selected shape
 */
export function drawHighlight(
  shape: CanvasShape,
  ctx: CanvasRenderingContext2D,
  scale: number,
  offsetX: number,
  offsetY: number,
) {
  const { x, y, width, height } = shape;
  ctx.save();
  ctx.strokeStyle = "#00A8FF";
  ctx.setLineDash([5, 5]);
  ctx.lineWidth = 1;
  ctx.strokeRect(
    (x + offsetX) * scale,
    (y + offsetY) * scale,
    width * scale,
    height * scale,
  );
  ctx.restore();
}

export function toDBShape(shape: CanvasShape): DBShape {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isSelected, isHovered, isDragging, persistStatus, ...dbShape } =
    shape;

  return dbShape;
}

export function stripUIProperties(shape: CanvasShape) {
  const {
    isSelected,
    isHovered,
    isDragging,
    persistStatus,
    lastPersistedVersion,
    ...dbShape
  } = shape;
  return dbShape;
}
