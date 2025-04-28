import { api } from "@/lib/config/axios.config";
import { LabWithMembers } from "@/lib/types/lab.type";

export const getAll = async (): Promise<LabWithMembers[]> => {
  const response = await api.get("/lab");

  return response.data.payload as LabWithMembers[];
};
