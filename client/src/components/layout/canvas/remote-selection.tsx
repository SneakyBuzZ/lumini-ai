import { CanvasShape } from "@/lib/types/canvas-type";

type Props = {
  selections: Map<string, string[]>;
  shapes: Record<string, CanvasShape>;
  userColorMap: Map<string, string>;
  transform: {
    scale: number;
    offsetX: number;
    offsetY: number;
  };
};

export function RemoteSelections({
  selections,
  shapes,
  userColorMap,
  transform,
}: Props) {
  const {
    x: xmin,
    y: ymin,
    width,
    height,
  } = getBoundingBox(
    Object.values(shapes).filter((s) =>
      [...selections.values()].some((ids) => ids.includes(s.id)),
    ),
  );

  return (
    <>
      {[...selections.entries()].map(([userId, shapeIds]) => {
        const color = userColorMap.get(userId) ?? "#60a5fa";
        const dashColor = withOpacity(color, 0.6);

        return shapeIds.map((shapeId) => {
          const shape = shapes[shapeId];
          if (!shape) return null;

          const x = xmin * transform.scale + transform.offsetX;
          const y = ymin * transform.scale + transform.offsetY;
          const w = width * transform.scale;
          const h = height * transform.scale;

          return (
            <>
              <div
                key={`${userId}-${shapeId}`}
                style={{
                  position: "absolute",
                  left: x - 6,
                  top: y - 6,
                  width: w + 12,
                  height: h + 12,
                  borderRadius: 4,
                  pointerEvents: "none",
                  zIndex: 40,

                  /* DASHED BORDER (canvas-like) */
                  // reduce color opacity for better visibility
                  background: `
                    linear-gradient(to right, ${dashColor} 73.5%, transparent 0) top / 8px 1px repeat-x,
                    linear-gradient(to right, ${dashColor} 73.5%, transparent 0) bottom / 8px 1px repeat-x,
                    linear-gradient(to bottom, ${dashColor} 73.5%, transparent 0) left / 1px 8px repeat-y,
                    linear-gradient(to bottom, ${dashColor} 73.5%, transparent 0) right / 1px 8px repeat-y
                    `,
                }}
              />

              {/* Drawing four circles at the corners */}
              <div
                key={`${userId}-${shapeId}-tl`}
                style={{
                  position: "absolute",
                  left: x - 10,
                  top: y - 10,
                  width: 8,
                  height: 8,
                  backgroundColor: color,
                  borderRadius: "50%",
                  pointerEvents: "none",
                  zIndex: 41,
                }}
              />
              <div
                key={`${userId}-${shapeId}-tr`}
                style={{
                  position: "absolute",
                  left: x + w + 2,
                  top: y - 10,
                  width: 8,
                  height: 8,
                  backgroundColor: color,
                  borderRadius: "50%",
                  pointerEvents: "none",
                  zIndex: 41,
                }}
              />
              <div
                key={`${userId}-${shapeId}-bl`}
                style={{
                  position: "absolute",
                  left: x - 10,
                  top: y + h + 2,
                  width: 8,
                  height: 8,
                  backgroundColor: color,
                  borderRadius: "50%",
                  pointerEvents: "none",
                  zIndex: 41,
                }}
              />
              <div
                key={`${userId}-${shapeId}-br`}
                style={{
                  position: "absolute",
                  left: x + w + 2,
                  top: y + h + 2,
                  width: 8,
                  height: 8,
                  backgroundColor: color,
                  borderRadius: "50%",
                  pointerEvents: "none",
                  zIndex: 41,
                }}
              />
            </>
          );
        });
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
