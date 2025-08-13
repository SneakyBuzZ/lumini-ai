import { api } from "@/lib/config/axios-config";
import { WorkspaceWithMembers } from "@/lib/types/workspace.type";
import { WorkspaceSettings } from "@/lib/data/types/workspace-types";

export const getAllWorkspaces = async (): Promise<
  WorkspaceWithMembers[] | void
> => {
  const response = await api.get("/workspace");

  return response.data.payload;
};

export const createWorkspace = async (
  name: string,
  plan: "free" | "pro" | "enterprise"
): Promise<number | void> => {
  const response = await api.post("/workspace", {
    name,
    plan,
  });

  return response.status;
};

export const getWorkspaceSettings = async (
  workspaceId: string
): Promise<WorkspaceSettings | null> => {
  const response = await api.get(`/workspace/settings/${workspaceId}`);

  return response.data.payload;
};
