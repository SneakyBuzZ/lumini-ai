import { useEffect, useRef } from "react";

export function useSocket(labId: string) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`http://localhost:5000/ws?labId=${labId}`);
    wsRef.current = ws;

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [labId]);

  return wsRef;
}
