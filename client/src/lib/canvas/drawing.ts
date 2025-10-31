import { DrawOptions, Shape } from "@/lib/types/canvas-type";
import { snapLine } from "@/lib/canvas/utils";

export const renderShapes = (
  shapes: Record<string, Shape>,
  ctx: CanvasRenderingContext2D,
  options: DrawOptions,
  editingText: {
    id: string;
    x: number;
    y: number;
    value: string;
  } | null = null
) => {
  const { scale, offsetX, offsetY } = options;
  const canvas = ctx.canvas;

  //* --- Clear canvas ---
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  //* --- Prepare shapes ---
  const allShapes = Object.values(shapes);
  const selectedShapes = allShapes.filter((s) => s.isSelected);
  const multipleSelected = selectedShapes.length > 1;

  //* --- Draw all shapes ---
  allShapes.forEach((shape) => {
    if (shape.strokeType === "dashed") ctx.setLineDash([6, 4]);
    else if (shape.strokeType === "dotted") ctx.setLineDash([2, 3]);
    else ctx.setLineDash([]);

    const strokeColor = shape.strokeColor;
    const fillColor = shape.fillColor;
    const strokeWidth = shape.strokeWidth;
    const safeScale = Number(scale);

    //* --- Set styles ---
    ctx.lineWidth = (strokeWidth / safeScale) * 2;
    if (shape.isDragging || shape.isHovered) {
      ctx.shadowColor = "rgba(0,0,0,0.2)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
    } else {
      ctx.shadowColor = "transparent";
    }

    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;

    // --- Draw shape ---
    switch (shape.type) {
      case "rectangle":
        drawRoundedRect(ctx, shape.x, shape.y, shape.width, shape.height, 12);
        break;
      case "ellipse":
        drawEllipse(ctx, shape);
        break;
      case "line":
        drawLine(ctx, shape);
        break;
      case "arrow":
        drawArrow(ctx, shape);
        break;
      case "text":
        drawText(ctx, shape);
        break;
    }

    // --- Draw text content ---
    if (shape.text?.trim()) {
      if (!(editingText && editingText.id === shape.id)) {
        drawText(
          ctx,
          shape.type === "text" ? shape : { ...shape, type: "text" }
        );
      }
    }

    // --- Draw selection outlines and handles ---
    if (shape.isSelected) {
      drawSelectionOutline(ctx, shape, multipleSelected, scale);
    }
  });

  // --- Draw group selection box ---
  if (multipleSelected) {
    const minX = Math.min(...selectedShapes.map((s) => s.x));
    const minY = Math.min(...selectedShapes.map((s) => s.y));
    const maxX = Math.max(...selectedShapes.map((s) => s.x + s.width));
    const maxY = Math.max(...selectedShapes.map((s) => s.y + s.height));

    ctx.save();
    ctx.strokeStyle = "rgba(0, 120, 215, 0.5)";
    ctx.setLineDash([4, 2]);
    ctx.lineWidth = 1;
    ctx.strokeRect(minX - 8, minY - 8, maxX - minX + 16, maxY - minY + 16);
    ctx.restore();
  }

  ctx.restore();
};

/* ---------------- Shape Drawing Helpers ---------------- */

export const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  const w = Math.abs(width);
  const h = Math.abs(height);
  const r = Math.min(Math.abs(radius), w / 2, h / 2);
  const left = width < 0 ? x + width : x;
  const top = height < 0 ? y + height : y;

  ctx.beginPath();
  ctx.moveTo(left + r, top);
  ctx.lineTo(left + w - r, top);
  ctx.quadraticCurveTo(left + w, top, left + w, top + r);
  ctx.lineTo(left + w, top + h - r);
  ctx.quadraticCurveTo(left + w, top + h, left + w - r, top + h);
  ctx.lineTo(left + r, top + h);
  ctx.quadraticCurveTo(left, top + h, left, top + h - r);
  ctx.lineTo(left, top + r);
  ctx.quadraticCurveTo(left, top, left + r, top);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

export const drawEllipse = (ctx: CanvasRenderingContext2D, shape: Shape) => {
  ctx.beginPath();
  ctx.ellipse(
    shape.x + shape.width / 2,
    shape.y + shape.height / 2,
    Math.abs(shape.width / 2),
    Math.abs(shape.height / 2),
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.stroke();
};

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  shape: Shape,
  enableSnap: boolean = false
) => {
  const { x, y, width, height } = shape;
  let x2 = x + width;
  let y2 = y + height;

  if (enableSnap) {
    const snapped = snapLine(x, y, x2, y2);
    x2 = snapped.x2;
    y2 = snapped.y2;
  }

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.stroke();
};

export const drawArrow = (
  ctx: CanvasRenderingContext2D,
  shape: Shape,
  enableSnap: boolean = false
) => {
  const { x, y } = shape;
  let { width, height } = shape;
  let x2 = x + width;
  let y2 = y + height;
  if (enableSnap) {
    const snapped = snapLine(x, y, x2, y2);
    x2 = snapped.x2;
    y2 = snapped.y2;
    width = x2 - x;
    height = y2 - y;
  }
  const lineLength = Math.sqrt(width * width + height * height);
  const headlen = Math.max(4, Math.min(lineLength * 0.12, 10));
  const angle = Math.atan2(height, width);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.fillStyle = shape.fillColor ?? ctx.strokeStyle;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - headlen * Math.cos(angle - 0.4),
    y2 - headlen * Math.sin(angle - 0.4)
  );
  ctx.lineTo(
    x2 - headlen * Math.cos(angle + 0.4),
    y2 - headlen * Math.sin(angle + 0.4)
  );
  ctx.closePath();
  ctx.fill();
};

export const drawText = (ctx: CanvasRenderingContext2D, shape: Shape) => {
  if (!shape.text || shape.text.trim() === "") return;

  ctx.save();
  ctx.fillStyle = shape.textColor ?? "#ebebeb";
  ctx.font = `${shape.fontWeight ?? "normal"} ${shape.fontSize ?? 16}px ${shape.fontFamily ?? "sans-serif"}`;
  ctx.textAlign = shape.textAlign ?? "center";
  ctx.textBaseline = "middle";

  const centerX = shape.x + shape.width / 2;
  const centerY = shape.y + shape.height / 2;

  ctx.fillText(shape.text, centerX, centerY, Math.abs(shape.width) - 8);
  ctx.restore();
};

/* ---------------- Selection Helpers ---------------- */

function drawSelectionOutline(
  ctx: CanvasRenderingContext2D,
  shape: Shape,
  multipleSelected: boolean,
  scale: number = 1
) {
  ctx.save();
  ctx.strokeStyle = "rgba(0, 120, 215, 0.5)";
  ctx.setLineDash([4, 2]);
  ctx.lineWidth = 1 / scale;

  if (shape.type === "line" || shape.type === "arrow") {
    ctx.beginPath();
    ctx.moveTo(shape.x, shape.y);
    ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
    ctx.setLineDash([]);
    ctx.stroke();
  } else if (!multipleSelected) {
    ctx.strokeRect(
      shape.x - 6,
      shape.y - 6,
      shape.width + 12,
      shape.height + 12
    );
  }

  ctx.restore();
}
