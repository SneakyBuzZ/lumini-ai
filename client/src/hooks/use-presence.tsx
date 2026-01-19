import { useEffect, useMemo, useRef, useState } from "react";

type PresenceUser = {
  id: string;
  color: string;
};

type PresenceEvent =
  | { type: "presence:snapshot"; users: PresenceUser[] }
  | { type: "presence:join"; user: PresenceUser }
  | { type: "presence:leave"; userId: string };

export function usePresence(labId: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const [users, setUsers] = useState<Map<string, PresenceUser>>(new Map());

  useEffect(() => {
    const ws = new WebSocket(`http://localhost:5000/ws?labId=${labId}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data) as PresenceEvent;

      setUsers((prev) => {
        const next = new Map(prev);

        switch (data.type) {
          case "presence:snapshot":
            next.clear();
            data.users.forEach((u) => next.set(u.id, u));
            break;

          case "presence:join":
            next.set(data.user.id, data.user);
            break;

          case "presence:leave":
            next.delete(data.userId);
            break;
        }

        return next;
      });
    };

    return () => {
      ws.close();
    };
  }, [labId]);

  const usersArray = useMemo(() => Array.from(users.values()), [users]);

  return usersArray;
}
