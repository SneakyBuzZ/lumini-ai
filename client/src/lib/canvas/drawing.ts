import { Shape } from "@/lib/types/canvas.type";
import { drawHighlight, snapLine } from "./utils";

export const renderShapes = (
  shapes: Shape[],
  ctx: CanvasRenderingContext2D,
  scale: number,
  offsetX: number,
  offsetY: number
) => {
  const canvas = ctx.canvas;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();

  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  shapes.forEach((shape) => {
    ctx.strokeStyle = shape.color;
    ctx.fillStyle = shape.color;
    ctx.lineWidth = 2;

    if (shape.isDragging || shape.isHovered) {
      ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
    } else {
      ctx.shadowColor = "transparent"; // reset shadow
    }

    if (shape.isSelected) {
      ctx.setLineDash([6, 4]); // dashed line
      drawHighlight(shape, ctx, scale, offsetX, offsetY);
    } else {
      ctx.setLineDash([]); // solid line
    }

    if (shape.type === "text") {
      ctx.font = "16px sans-serif";
      ctx.fillText(shape.text ?? "", shape.x, shape.y + 16);
      return;
    }

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
    }

    // ✅ If selected, draw a bounding box or handle points (optional enhancement)
    if (shape.isSelected) {
      ctx.save();
      ctx.strokeStyle = "#007AFF"; // highlight color
      ctx.setLineDash([4, 2]);
      ctx.lineWidth = 1;
      ctx.strokeRect(
        shape.x - 4,
        shape.y - 4,
        shape.width + 8,
        shape.height + 8
      );
      ctx.restore();
    }
  });

  ctx.restore(); // 🔁 Reset transform, shadow, dash
};

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

  // Dynamic arrowhead as before
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
