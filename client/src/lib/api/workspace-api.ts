import { api } from "@/lib/config/axios-config";
import { CreateWorkspace } from "@/lib/api/dto";
import { Workspace } from "@/lib/types/workspace-type";

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

// export const getWorkspaceSettings = async (
//   workspaceId: string
// ): Promise<WorkspaceSettings | null> => {
//   const response = await api.get(`/workspace/settings/${workspaceId}`);

//   return response.data.payload;
// };
