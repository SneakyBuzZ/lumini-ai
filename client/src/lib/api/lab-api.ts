import { api } from "@/lib/config/axios-config";
import { Lab, LabWithMembers } from "@/lib/types/lab.type";
import { Answer } from "@/lib/types/answer.type";
import { CreateLab } from "@/lib/api/dto";

export const create = async (data: CreateLab) => {
  await api.post("/lab/", data);
};

export const getAllLabs = async (workspaceId: string): Promise<Lab[]> => {
  const response = await api.get(`/lab/${workspaceId}`);
  return response.data.payload;
};

export const getLabsByWorkspaceId = async (
  workspaceId: string
): Promise<LabWithMembers[]> => {
  const response = await api.get(`/lab/${workspaceId}`);

  return response.data.payload as LabWithMembers[];
};

export const getAnswer = async (
  query: string,
  labId: string
): Promise<Answer | null> => {
  const response = await api.post(`/lab/ask/${labId}`, {
    query,
  });

  return response.data.payload;
};
