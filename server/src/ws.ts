import type { WebSocket } from "ws";
import type { Server } from "http";
import { WebSocketServer } from "ws";
import { validateSocketConnection } from "@/lib/ws/validation";
import { joinLab, leaveLab } from "@/lib/ws/ws-room";
import { broadcastPresenceUpdate, broadcastToLab } from "@/lib/ws/ws-events";
import { EventType, PresenceJoinEvent, WSEvent } from "@/lib/types/ws-type";

export const initWebSocketServer = (server: Server) => {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
  });

  wss.on("connection", async (socket: WebSocket, req) => {
    try {
      //^ ---- VALIDATION ----
      const response = await validateSocketConnection(socket, req);
      const { labId, user, color } = response || {};
      if (!labId || !user || !color)
        throw new Error("labId or user missing after validation");

      //^ ---- PRESENCE JOIN ----
      broadcastPresenceUpdate(socket, labId);

      //^ ---- JOIN LAB ----
      joinLab(labId, socket);

      //^ ---- BROADCAST JOIN EVENT ----
      const data: PresenceJoinEvent = {
        type: "presence:join",
        user: {
          id: user.id,
          color: color,
        },
      };
      broadcastToLab(labId, data, socket);
    } catch (error) {
      socket.close(1008, "Authentication Failed");
      return;
    }

    socket.on("message", (raw) => {
      let data: any;
      try {
        data = JSON.parse(raw.toString());
      } catch {
        return;
      }

      const labId = socket.labId;
      const user = socket.user;
      if (!labId || !user) return;

      const eventType: EventType = data.type;

      if (eventType === "cursor:move") {
        //^ ---- BROADCAST CURSOR MOVE EVENT ----
        const event: WSEvent = {
          type: "cursor:move",
          userId: user.id,
          x: data.x,
          y: data.y,
        };
        broadcastToLab(labId, event, socket);
      } else if (eventType === "selection:update") {
        //^ ---- BROADCAST SELECTION UPDATE EVENT ----
        const event: WSEvent = {
          type: "selection:update",
          userId: user.id,
          shapeIds: data.shapeIds,
        };
        broadcastToLab(labId, event, socket);
      } else if (eventType === "selection:clear") {
        //^ ---- BROADCAST SELECTION CLEAR EVENT ----
        const event: WSEvent = {
          type: "selection:clear",
          userId: user.id,
        };
        broadcastToLab(labId, event, socket);
      }
    });

    socket.on("close", () => {
      const { labId, user } = socket as any;
      if (!labId || !user) return;

      //^ ---- LEAVE LAB ----
      leaveLab(labId, socket);

      //^ ---- BROADCAST CURSOR LEAVE EVENT ----
      const leaveData: WSEvent = {
        type: "cursor:leave",
        userId: user.id,
      };
      broadcastToLab(labId, leaveData, socket);

      //^ ---- BROADCAST LEAVE EVENT ----
      const data: WSEvent = {
        type: "presence:leave",
        userId: user.id,
      };
      broadcastToLab(labId, data, socket);
    });
  });

  return wss;
};
