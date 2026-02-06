import { WebSocket } from "ws";
import { PresenceSnapshotEvent, WSEvent } from "../types/ws-type";

export type LabId = string;
const labRooms = new Map<LabId, Set<WebSocket>>();

export function joinLab(labId: LabId, socket: WebSocket) {
  let room = labRooms.get(labId);
  if (!room) {
    room = new Set();
    labRooms.set(labId, room);
  }
  room.add(socket);
}

export function leaveLab(labId: LabId, socket: WebSocket) {
  const room = labRooms.get(labId);
  if (!room) return;

  room.delete(socket);

  if (room.size === 0) {
    labRooms.delete(labId);
  }
}

export function getSockets(labId: LabId): Set<WebSocket> | undefined {
  return labRooms.get(labId);
}

export function getSocketsArray(labId: string) {
  const room = labRooms.get(labId);
  if (!room) return [];
  return Array.from(room.values());
}

export function broadcastToLab(labId: string, data: WSEvent, ws?: WebSocket) {
  const sockets = labRooms.get(labId);
  if (!sockets) return;

  const payload = JSON.stringify(data);

  for (const socket of sockets) {
    if (ws && socket === ws) continue;
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(payload);
    }
  }
}

export function sendPresenceSnapshot(labId: string, ws: WebSocket) {
  const snapshot = getSocketsArray(labId);

  const data: PresenceSnapshotEvent = {
    type: "presence:snapshot",
    users: snapshot.map((s) => {
      if (!s.user || !s.color) throw new Error("Socket user or color missing");
      return { id: s.user.id, color: s.color };
    }),
  };
  ws.send(JSON.stringify(data));
}
