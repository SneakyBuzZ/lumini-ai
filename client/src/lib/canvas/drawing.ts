import { DrawOptions, Shape } from "@/lib/types/canvas-type";
import { snapLine } from "@/lib/canvas/utils";

export const renderShapes = (
  shapes: Record<string, Shape>,
  ctx: CanvasRenderingContext2D,
  options: DrawOptions
) => {
  const { scale, offsetX, offsetY } = options;
  const canvas = ctx.canvas;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  // iterate over the record values and hightlight selected shapes
  Object.values(shapes).forEach((shape) => {
    const strokeColor = shape.strokeColor ?? "#3d3d3d";
    const fillColor = shape.fillColor ?? "transparent";
    const strokeWidth: number = Number(shape.strokeWidth ?? 2);
    const safeScale: number = Number(scale);

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

    // draw selection outline (not for text)
    if (shape.isSelected && shape.type !== "text") {
      ctx.save();
      ctx.strokeStyle = "rgba(0, 120, 215, 0.5)";
      ctx.setLineDash([4, 2]);
      ctx.lineWidth = 1;
      ctx.strokeRect(
        shape.x - 10,
        shape.y - 10,
        shape.width + 20,
        shape.height + 20
      );
      ctx.restore();
    }
  });

  ctx.restore();
};

// ---------- Individual draw functions ----------

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
  enableSnap: boolean = true
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
  enableSnap: boolean = true
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
  const headlen = Math.max(6, Math.min(lineLength * 0.22, 16));
  const angle = Math.atan2(height, width);

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - headlen * Math.cos(angle - 0.3),
    y2 - headlen * Math.sin(angle - 0.3)
  );
  ctx.lineTo(
    x2 - headlen * Math.cos(angle + 0.3),
    y2 - headlen * Math.sin(angle + 0.3)
  );
  ctx.closePath();
  ctx.fill();
};

export const drawText = (ctx: CanvasRenderingContext2D, shape: Shape) => {
  ctx.fillStyle = shape.fillColor ?? "#000";
  ctx.font = `${shape.fontSize ?? 16}px ${shape.fontFamily ?? "sans-serif"}`;
  ctx.fillText(shape.text ?? "", shape.x, shape.y + (shape.fontSize ?? 16));
};
