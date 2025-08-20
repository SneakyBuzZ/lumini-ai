import { api } from "@/lib/config/axios-config";
import { CreateWorkspace } from "@/lib/data/dtos/workspace-dtos";
import useProjectStore from "@/lib/store/project-store";

export const getAllWorkspaces = async () => {
  const { setWorkspaces, setCurrentWorkspace } = useProjectStore.getState();
  const response = await api.get("/workspace");
  setWorkspaces(response.data.payload);
  setCurrentWorkspace(response.data.payload[0]);
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
