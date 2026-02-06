import { CanvasShape } from "@/lib/types/canvas-type";
import { Fragment } from "react";

interface Props {
  selections: Map<string, string[]>;
  shapes: Record<string, CanvasShape>;
  userColorMap: Map<string, string>;
  transform: {
    scale: number;
    offsetX: number;
    offsetY: number;
  };
}

export function RemoteSelections({
  selections,
  shapes,
  userColorMap,
  transform,
}: Props) {
  return (
    <>
      {[...selections.entries()].map(([userId, shapeIds]) => {
        if (shapeIds.length === 0) return null;

        const selectedShapes = shapeIds.map((id) => shapes[id]).filter(Boolean);

        if (selectedShapes.length === 0) return null;

        const { x, y, width, height } = getBoundingBox(selectedShapes);

        const color = userColorMap.get(userId) ?? "#60a5fa";
        const dashColor = withOpacity(color, 0.6);

        const left = x * transform.scale + transform.offsetX;
        const top = y * transform.scale + transform.offsetY;
        const w = width * transform.scale;
        const h = height * transform.scale;

        return (
          <Fragment key={userId}>
            {/* Outline */}
            <div
              style={{
                position: "absolute",
                left: left - 6,
                top: top - 6,
                width: w + 12,
                height: h + 12,
                borderRadius: 4,
                pointerEvents: "none",
                zIndex: 40,
                background: `
                  linear-gradient(to right, ${dashColor} 73.5%, transparent 0) top / 8px 1px repeat-x,
                  linear-gradient(to right, ${dashColor} 73.5%, transparent 0) bottom / 8px 1px repeat-x,
                  linear-gradient(to bottom, ${dashColor} 73.5%, transparent 0) left / 1px 8px repeat-y,
                  linear-gradient(to bottom, ${dashColor} 73.5%, transparent 0) right / 1px 8px repeat-y
                `,
              }}
            />

            {/* Corners */}
            {[
              [left - 10, top - 10],
              [left + w + 2, top - 10],
              [left - 10, top + h + 2],
              [left + w + 2, top + h + 2],
            ].map(([cx, cy], i) => (
              <div
                key={`${userId}-corner-${i}`}
                style={{
                  position: "absolute",
                  left: cx,
                  top: cy,
                  width: 8,
                  height: 8,
                  backgroundColor: color,
                  borderRadius: "50%",
                  pointerEvents: "none",
                  zIndex: 41,
                }}
              />
            ))}
          </Fragment>
        );
      })}
    </>
  );
}

function withOpacity(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function getBoundingBox(shapes: CanvasShape[]) {
  const minX = Math.min(...shapes.map((s) => s.x));
  const minY = Math.min(...shapes.map((s) => s.y));
  const maxX = Math.max(...shapes.map((s) => s.x + s.width));
  const maxY = Math.max(...shapes.map((s) => s.y + s.height));
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}
