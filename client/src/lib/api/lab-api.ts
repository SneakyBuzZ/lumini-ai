import { api } from "@/lib/config/axios-config";
import axios from "axios";
import { Lab, LabWithMembers } from "@/lib/types/lab-type";
import { Answer } from "@/lib/types/answer.type";
import { CreateLab } from "@/lib/api/dto";

export const create = async (data: CreateLab) => {
  const response = await api.post("/lab/", data);
  console.log("STATUS: ", response.status);
  if (response.status === 201) {
    const labId = response.data.payload.labId;
    const fastapiurl = `http://localhost:8000/api/lab-files/all/${labId}`;
    await axios.post(
      fastapiurl,
      { repo_url: data.githubUrl },
      {
        withCredentials: true,
      }
    );
  }
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

export const askQuery = async (query: string, labId: string) => {
  const fastapiurl = `http://localhost:8000/api/lab-files/ask/${labId}`;

  const response = await fetch(fastapiurl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
    credentials: "include",
  });

  if (!response.ok || !response.body) {
    throw new Error("Failed to connect to AI service");
  }

  return response;
};

export const getSessionId = async (labId: string) => {
  const fastapiurl = `http://localhost:8000/api/lab-chat/sessions/${labId}`;
  const response = await axios.get(fastapiurl, {
    withCredentials: true,
  });
  return response.data.id;
};

export const getLabChats = async (sessionId: string) => {
  const fastapiurl = `http://localhost:8000/api/lab-chat/messages/${sessionId}`;
  const response = await axios.get(fastapiurl, {
    withCredentials: true,
  });
  return response.data.payload;
};
