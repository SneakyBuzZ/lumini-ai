import { ShapeDTO } from "@/_lab/dto";

export type EventType =
  | "presence:join"
  | "presence:leave"
  | "presence:snapshot"
  | "cursor:move"
  | "cursor:leave"
  | "selection:update"
  | "selection:clear"
  | "shape:commit"
  | "shape:preview";

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

export type SelectionUpdate = {
  type: "selection:update";
  userId: string;
  shapeIds: string[];
};

export type SelectionClear = {
  type: "selection:clear";
  userId: string;
};

export type ShapeCommitBatchEvent = {
  type: "shape:commit";
  labId: string;
  authorId: string;
  commits: Array<{
    shapeId: string;
    commitType: "new" | "updated" | "deleted";
    commitVersion: number;
    shape: Partial<ShapeDTO>;
  }>;
};

export type ShapePreviewEvent = {
  type: "shape:preview";
  shapeId: string;
  patch: Partial<ShapeDTO>;
  authorId: string;
};

export type WSEvent =
  | PresenceJoinEvent
  | PresenceLeaveEvent
  | PresenceSnapshotEvent
  | CursorMoveEvent
  | CursorLeaveEvent
  | SelectionUpdate
  | SelectionClear
  | ShapeCommitBatchEvent
  | ShapePreviewEvent;
