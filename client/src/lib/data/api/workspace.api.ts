import { api } from "@/lib/config/axios.config";
import { WorkspaceWithMembers } from "@/lib/types/workspace.type";

export const getAllWorkspaces = async (): Promise<
  WorkspaceWithMembers[] | void
> => {
  const response = await api.get("/workspace");

  return response.data.payload;
};
