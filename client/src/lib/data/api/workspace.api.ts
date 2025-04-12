import { api } from "@/lib/config/axios.config";
import { Workspace } from "../types/workspace.type";

export const getAllWorkspaces = async (): Promise<Workspace[] | void> => {
  const response = await api.get("/workspace");

  return response.data.payload;
};
