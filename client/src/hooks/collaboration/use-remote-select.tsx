import {
  getSelectionSnapshot,
  handleSelectionEvent,
} from "@/lib/canvas/remote-select";
import { useEffect, useState } from "react";

export function useRemoteSelect(ws: WebSocket | null) {
  const [selects, setSelects] = useState(getSelectionSnapshot());

  useEffect(() => {
    if (!ws) return;

    function onMessage(e: MessageEvent) {
      const data = JSON.parse(e.data);
      if (data.type === "selection:update" || data.type === "selection:clear") {
        handleSelectionEvent(data);
        setSelects(getSelectionSnapshot());
      }
    }

    ws.addEventListener("message", onMessage);
    return () => ws.removeEventListener("message", onMessage);
  }, [ws]);

  return selects;
}
