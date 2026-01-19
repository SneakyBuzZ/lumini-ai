import { getCursorsSnapshot, handleCursorEvent } from "@/lib/canvas/cursor";
import { useEffect, useState } from "react";

export default function useRemoteCursors(ws: WebSocket | null) {
  const [, forceRender] = useState(0);

  useEffect(() => {
    if (!ws) return;

    function onMessage(e: MessageEvent) {
      const data = JSON.parse(e.data);

      if (data.type === "cursor:move" || data.type === "cursor:leave") {
        handleCursorEvent(data);
        forceRender((x) => x + 1); // 🔑 trigger React update
      }
    }

    ws.addEventListener("message", onMessage);

    return () => {
      ws.removeEventListener("message", onMessage);
    };
  }, [ws]);

  return getCursorsSnapshot();
}
