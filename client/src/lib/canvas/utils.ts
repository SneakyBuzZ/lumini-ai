import { Shape } from "@/lib/types/canvas.type";

export const initialiseCanvas = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
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

export const getLocation = (e: React.MouseEvent, canvas: HTMLCanvasElement) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  return { x, y };
};

export const getCanvasCoords = (
  e: React.MouseEvent,
  canvas: HTMLCanvasElement,
  scale: number,
  offsetX: number,
  offsetY: number
) => {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left - offsetX) / scale;
  const y = (e.clientY - rect.top - offsetY) / scale;
  return { x, y };
};

export function snapLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  thresholdDeg = 7
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = Math.atan2(dy, dx); // radians
  const deg = (angle * 180) / Math.PI;

  // Snap angles: 0°, 45°, 90°, 135°, 180°, etc.
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
  // No snap, return original
  return { x2, y2 };
}

export function isPointInsideShape(
  shape: Shape,
  px: number,
  py: number
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
    // Simple distance-to-line formula
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

    return distance <= 6; // click radius
  }

  return false;
}

export function drawHighlight(
  shape: Shape,
  ctx: CanvasRenderingContext2D,
  scale: number,
  offsetX: number,
  offsetY: number
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
    height * scale
  );
  ctx.restore();
}
