import { WebSocket } from "ws";
import { getSockets, getSocketsArray } from "@/lib/ws/ws-room";
import { PresenceSnapshotEvent, WSEvent } from "@/lib/types/ws-type";

export function broadcastToLab(
  labId: string,
  data: WSEvent,
  except?: WebSocket,
) {
  const sockets = getSockets(labId);
  if (!sockets) return;

  const payload = JSON.stringify(data);

  for (const socket of sockets) {
    if (socket !== except && socket.readyState === WebSocket.OPEN) {
      socket.send(payload);
    }
  }
}

export function broadcastPresenceUpdate(socket: WebSocket, labId: string) {
  const snapshot = getSocketsArray(labId);

  const data: PresenceSnapshotEvent = {
    type: "presence:snapshot",
    users: snapshot.map((s) => {
      if (!s.user || !s.color) throw new Error("Socket user or color missing");
      return { id: s.user.id, color: s.color };
    }),
  };

  socket.send(JSON.stringify(data));
}
