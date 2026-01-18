import { DBShape } from "@/lib/types/lab-type";

export type RegisterType = {
  name: string;
  email: string;
  password: string;
};

export type LoginType = {
  email: string;
  password: string;
};

export type CreateLab = {
  name: string;
  githubUrl: string;
  workspaceId: string;
  plan: "free" | "pro" | "enterprise";
};

export type CreateWorkspace = {
  name: string;
  plan: "free" | "pro" | "enterprise";
};

export type CreateInvite = {
  email: string;
  role: string;
};

export type GetSnapshot = {
  labId: string;
  data: {
    shapes: Record<string, DBShape>;
  };
  version: number;
};

export type CreateOrUpdateOp = {
  op: "create" | "update";
  shapeId: string;
  commitVersion: number;
  payload: DBShape;
};

export type DeleteOp = {
  op: "delete";
  shapeId: string;
  commitVersion: number;
  payload: null;
};

export type ShapeBatchOperation = CreateOrUpdateOp | DeleteOp;
export interface BatchUpdateShapes {
  labId: string;
  operations: ShapeBatchOperation[];
}

export type UpsertView = {
  scale: number;
  offsetX: number;
  offsetY: number;
};
