import { api } from "@/lib/config/axios-config";
import { CreateWorkspace } from "@/lib/api/dto";
import { Workspace, WorkspaceSettingsMap } from "@/lib/types/workspace-type";
import { UpdateGeneralSettings, UpdatePreferences } from "./dto/workspace-dto";

//*--------- WORKSPACE API ---------*//
export const getAllWorkspaces = async (): Promise<Workspace[]> => {
  const response = await api.get("/workspace");
  return response.data.payload;
};

export const createWorkspace = async (data: CreateWorkspace) => {
  const response = await api.post("/workspace", data);
  return response.data.payload;
};

export const getWorkspaceBySlug = async (slug: string): Promise<Workspace> => {
  const response = await api.get(`/workspace/${slug}`);
  return response.data.payload;
};

export const getWorkspaceIdByLabSlug = async (labSlug: string) => {
  const response = await api.get(`/lab/${labSlug}/workspace`);
  return response.data.payload.workspaceId;
};

//* -------- WORKSPACE SETTINGS API ---------*//
export const getWorkspaceSettings = async <
  T extends keyof WorkspaceSettingsMap,
>(
  settingType: T,
  slug: string,
): Promise<WorkspaceSettingsMap[T]> => {
  const response = await api.get(`/workspace/${slug}/settings/${settingType}`);
  return response.data.payload;
};

export const updateWorkspaceGeneralSettings = async (
  data: UpdateGeneralSettings,
  slug: string,
) => {
  const response = await api.put(`/workspace/${slug}/settings/general`, data);
  return response.data.payload;
};

export const updateWorkspacePreferences = async (
  data: UpdatePreferences,
  slug: string,
) => {
  const response = await api.put(
    `/workspace/${slug}/settings/preferences`,
    data,
  );
  return response.data.payload;
};

//* -------- WORKSPACE MEMBERS API ---------*//
export const getWorkspaceMembers = async (slug: string) => {
  const response = await api.get(`/workspace/${slug}/members`);
  return response.data.payload;
};

//* -------- WORKSPACE INVITES API ---------*//
export const createWorkspaceInvite = async (
  email: string,
  role: string,
  slug: string,
) => {
  const response = await api.post(`/workspace/${slug}/invite`, {
    email,
    role,
  });
  return response.data.payload;
};

export const acceptWorkspaceInvite = async (token: string): Promise<string> => {
  const response = await api.post(`/workspace/invite/accept`, { token });
  return response.data.payload.workspaceId;
};
