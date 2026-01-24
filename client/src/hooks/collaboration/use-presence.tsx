import { useEffect, useMemo, useState } from "react";

type PresenceUser = {
  id: string;
  color: string;
};

type PresenceEvent =
  | { type: "presence:snapshot"; users: PresenceUser[] }
  | { type: "presence:join"; user: PresenceUser }
  | { type: "presence:leave"; userId: string };

export function usePresence(wsRef: React.RefObject<WebSocket | null>) {
  const [users, setUsers] = useState<Map<string, PresenceUser>>(new Map());

  useEffect(() => {
    if (!wsRef.current) return;
    const ws = wsRef.current;
    ws.addEventListener("message", (event) => onMessage(event, setUsers));

    return () => {
      ws.removeEventListener("message", (event) => onMessage(event, setUsers));
    };
  }, [wsRef]);

  return useMemo(() => Array.from(users.values()), [users]);
}

function onMessage(
  event: MessageEvent,
  setUsers: React.Dispatch<React.SetStateAction<Map<string, PresenceUser>>>,
) {
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
}
