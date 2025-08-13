import { api } from "@/lib/config/axios-config";
import { LabWithMembers } from "@/lib/types/lab.type";
import { CreateLab } from "../types/lab-types";
import { Answer } from "@/lib/types/answer.type";

export const create = async (data: CreateLab): Promise<number> => {
  const response = await api.post("/lab/", data);

  return response.status;
};

export const getAll = async (): Promise<LabWithMembers[]> => {
  const response = await api.get("/lab/");

  return response.data.payload as LabWithMembers[];
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
