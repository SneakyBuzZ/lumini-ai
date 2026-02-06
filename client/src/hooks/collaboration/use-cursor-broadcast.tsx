import { useEffect } from "react";
import { throttle } from "lodash";

export function useCursorBroadcast(
  ws: WebSocket | null,
  containerRef: React.RefObject<HTMLElement>,
  transform: {
    scale: number;
    offsetX: number;
    offsetY: number;
  },
) {
  useEffect(() => {
    const el = containerRef.current;
    if (!ws || !el) return;

    const send = throttle((x: number, y: number) => {
      if (ws.readyState !== WebSocket.OPEN) return;
      ws.send(JSON.stringify({ type: "cursor:move", x, y }));
    }, 30);

    function onMouseMove(e: MouseEvent) {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const canvasX =
        (e.clientX - rect.left - transform.offsetX) / transform.scale;
      const canvasY =
        (e.clientY - rect.top - transform.offsetY) / transform.scale;
      send(canvasX, canvasY);
    }

    function onMouseLeave() {
      if (!ws) return;
      if (ws.readyState !== WebSocket.OPEN) return;
      ws.send(JSON.stringify({ type: "cursor:leave" }));
    }

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
      send.cancel();
    };
  }, [ws, containerRef, transform]);
}
