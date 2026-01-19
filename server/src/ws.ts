import type { WebSocket } from "ws";
import type { Server } from "http";
import { WebSocketServer } from "ws";
import { validateSocketConnection } from "@/lib/ws/validation";
import { joinLab, leaveLab } from "@/lib/ws/ws-room";
import { broadcastPresenceUpdate, broadcastToLab } from "@/lib/ws/ws-events";
import { PresenceJoinEvent, PresenceLeaveEvent } from "@/lib/types/ws-type";

export const initWebSocketServer = (server: Server) => {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
  });

  wss.on("connection", async (socket: WebSocket, req) => {
    try {
      //^ ---- VALIDATION ----
      await validateSocketConnection(socket, req);

      //^ ---- PRESENCE JOIN ----
      broadcastPresenceUpdate(socket);

      //^ ---- JOIN LAB ----
      const { labId } = socket as any;
      joinLab(labId, socket);

      //^ ---- BROADCAST JOIN EVENT ----
      const data: PresenceJoinEvent = {
        type: "presence:join",
        user: {
          id: (socket as any).user.id,
          color: (socket as any).color,
        },
      };
      broadcastToLab(labId, data, socket);
    } catch (error) {
      socket.close(1008, "Authentication Failed");
      return;
    }

    socket.on("close", () => {
      const { labId, user } = socket as any;
      if (labId) leaveLab(labId, socket);

      //^ ---- BROADCAST LEAVE EVENT ----
      const data: PresenceLeaveEvent = {
        type: "presence:leave",
        userId: user.id,
      };
      broadcastToLab(labId, data, socket);
    });
  });

  return wss;
};
