import {
  getCursorsSnapshot,
  handleCursorEvent,
} from "@/lib/canvas/remote-cursor";
import { useEffect, useState } from "react";

export default function useRemoteCursors(ws: WebSocket | null) {
  const [remoteCursors, setRemoteCursors] = useState(getCursorsSnapshot());

  useEffect(() => {
    if (!ws) return;

    async function onMessage(e: MessageEvent) {
      const data = JSON.parse(e.data);
      if (data.type === "cursor:move" || data.type === "cursor:leave") {
        handleCursorEvent(data);
        setRemoteCursors(getCursorsSnapshot());
      }
    }

    ws.addEventListener("message", onMessage);
    return () => ws.removeEventListener("message", onMessage);
  }, [ws, remoteCursors]);

  return remoteCursors;
}
