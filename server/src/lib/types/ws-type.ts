export type PresenceUser = {
  id: string;
  color: string;
};

export type PresenceJoinEvent = {
  type: "presence:join";
  user: PresenceUser;
};

export type PresenceLeaveEvent = {
  type: "presence:leave";
  userId: string;
};

export type PresenceSnapshotEvent = {
  type: "presence:snapshot";
  users: PresenceUser[];
};

export type CursorMoveEvent = {
  type: "cursor:move";
  userId: string;
  x: number;
  y: number;
};

export type CursorLeaveEvent = {
  type: "cursor:leave";
  userId: string;
};

export type WSEvent =
  | PresenceJoinEvent
  | PresenceLeaveEvent
  | PresenceSnapshotEvent
  | CursorMoveEvent
  | CursorLeaveEvent;
