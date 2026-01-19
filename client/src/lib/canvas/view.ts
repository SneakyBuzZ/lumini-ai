import { CanvasShape } from "@/lib/types/canvas-type";

export function computeZoomToFit(
  shapes: CanvasShape[],
  viewportWidth: number,
  viewportHeight: number,
  padding = 40,
) {
  const xs = shapes.flatMap((s) => [s.x, s.x + s.width]);
  const ys = shapes.flatMap((s) => [s.y, s.y + s.height]);

  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);

  const contentWidth = maxX - minX;
  const contentHeight = maxY - minY;

  const scale = Math.min(
    (viewportWidth - padding * 2) / contentWidth,
    (viewportHeight - padding * 2) / contentHeight,
  );

  const offsetX = viewportWidth / 2 - (minX + contentWidth / 2) * scale;
  const offsetY = viewportHeight / 2 - (minY + contentHeight / 2) * scale;

  return {
    scale: Math.min(Math.max(scale, 0.1), 2),
    offsetX,
    offsetY,
  };
}
