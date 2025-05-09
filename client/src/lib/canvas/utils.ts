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
