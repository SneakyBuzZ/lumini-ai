import { useEffect, useState } from "react";

export function useSocket(labId: string) {
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!labId) return;
    const ws = new WebSocket(`http://localhost:5000/ws?labId=${labId}`);
    setWs(ws);

    return () => {
      ws.close();
      setWs(null);
    };
  }, [labId]);

  return ws;
}
