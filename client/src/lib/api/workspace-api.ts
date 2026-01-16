import { api } from "@/lib/config/axios-config";
import { CreateWorkspace } from "@/lib/api/dto";
import { Workspace, WorkspaceSettingsMap } from "@/lib/types/workspace-type";

export const getAllWorkspaces = async (): Promise<Workspace[]> => {
  const response = await api.get("/workspace");
  return response.data.payload;
};

export const createWorkspace = async (
  data: CreateWorkspace
): Promise<number> => {
  const response = await api.post("/workspace", data);
  return response.status;
};

export const getWorkspaceSettings = async <
  T extends keyof WorkspaceSettingsMap,
>(
  settingType: T,
  workspaceId: string
): Promise<WorkspaceSettingsMap[T]> => {
  const response = await api.get(
    `/workspace/${workspaceId}/settings/${settingType}`
  );
  return response.data.payload;
};

export const getWorkspaceMembers = async (workspaceId: string) => {
  const response = await api.get(`/workspace/${workspaceId}/members`);
  return response.data.payload;
};

export const createWorkspaceInvite = async (
  workspaceId: string,
  email: string,
  role: string
) => {
  const response = await api.post(`/workspace/${workspaceId}/invite`, {
    email,
    role,
  });
  return response.data.payload;
};

export const acceptWorkspaceInvite = async (token: string): Promise<string> => {
  const response = await api.post(`/workspace/invite/accept`, { token });
  return response.data.payload.workspaceId;
};
