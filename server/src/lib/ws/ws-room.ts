import { WebSocket } from "ws";

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
