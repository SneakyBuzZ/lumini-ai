import { useEffect, useMemo, useReducer } from "react";

export type PresenceUser = {
  id: string;
  color: string;
};

type PresenceEvent =
  | { type: "presence:snapshot"; users: PresenceUser[] }
  | { type: "presence:join"; user: PresenceUser }
  | { type: "presence:leave"; userId: string };

type PresenceState = {
  hydrated: boolean;
  users: Map<string, PresenceUser>;
};

type Action =
  | { type: "SNAPSHOT"; users: PresenceUser[] }
  | { type: "JOIN"; user: PresenceUser }
  | { type: "LEAVE"; userId: string };

function presenceReducer(state: PresenceState, action: Action): PresenceState {
  switch (action.type) {
    case "SNAPSHOT": {
      const map = new Map<string, PresenceUser>();
      for (const u of action.users) {
        map.set(u.id, u);
      }
      return { hydrated: true, users: map };
    }

    case "JOIN": {
      if (!state.hydrated) return state;
      if (state.users.has(action.user.id)) return state;

      const next = new Map(state.users);
      next.set(action.user.id, action.user);
      return { ...state, users: next };
    }

    case "LEAVE": {
      if (!state.users.has(action.userId)) return state;

      const next = new Map(state.users);
      next.delete(action.userId);
      return { ...state, users: next };
    }

    default:
      return state;
  }
}

export function usePresence(ws: WebSocket | null) {
  const [state, dispatch] = useReducer(presenceReducer, {
    hydrated: false,
    users: new Map(),
  });

  useEffect(() => {
    if (!ws) return;

    const handler = (event: MessageEvent) => {
      let data: PresenceEvent;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      switch (data.type) {
        case "presence:snapshot":
          dispatch({ type: "SNAPSHOT", users: data.users });
          break;

        case "presence:join":
          dispatch({ type: "JOIN", user: data.user });
          break;

        case "presence:leave":
          dispatch({ type: "LEAVE", userId: data.userId });
          break;
      }
    };

    ws.addEventListener("message", handler);
    return () => ws.removeEventListener("message", handler);
  }, [ws]);

  return useMemo(() => Array.from(state.users.values()), [state.users]);
}
