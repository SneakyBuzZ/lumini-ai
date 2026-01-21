import {
  getSelectionSnapshot,
  handleSelectionEvent,
} from "@/lib/canvas/remote-select";
import { useEffect, useState } from "react";

export function useRemoteSelect(ws: WebSocket | null) {
  const [, forceRender] = useState(0);

  useEffect(() => {
    if (!ws) return;

    function onMessage(e: MessageEvent) {
      const data = JSON.parse(e.data);

      if (data.type === "selection:update" || data.type === "selection:clear") {
        handleSelectionEvent(data);
        forceRender((x) => x + 1);
      }
    }

    ws.addEventListener("message", onMessage);
    return () => ws.removeEventListener("message", onMessage);
  }, [ws]);

  return getSelectionSnapshot();
}
