import { api } from "@/lib/config/axios-config";
import axios from "axios";
import {
  DBShape,
  Lab,
  LabSettings,
  LabWithMembers,
} from "@/lib/types/lab-type";
import { Answer } from "@/lib/types/answer.type";
import {
  BatchUpdateShapes,
  CreateLab,
  GetOverviewResponse,
  GetSnapshot,
  UpsertView,
} from "@/lib/api/dto";

//* --- LAB API CALLS ---

export const create = async (data: CreateLab) => {
  const response = await api.post("/lab/", data);
  if (response.status === 201) {
    const labId = response.data.payload.labId;
    const fastapiurl = `http://localhost:8000/api/lab-files/all/${labId}`;
    await axios.post(
      fastapiurl,
      { repo_url: data.githubUrl },
      {
        withCredentials: true,
      },
    );
  }
};

export const getBySlug = async (slug: string): Promise<Lab> => {
  const response = await api.get(`/lab/${slug}`);
  return response.data.payload;
};

export const getAllLabs = async (slug: string): Promise<Lab[]> => {
  const response = await api.get(`/lab/${slug}/workspace/all`);
  return response.data.payload;
};

export const getSettings = async (labSlug: string): Promise<LabSettings> => {
  const response = await api.get(`/lab/${labSlug}/settings`);
  return response.data.payload as LabSettings;
};

export const getLabsByWorkspaceId = async (
  workspaceId: string,
): Promise<LabWithMembers[]> => {
  const response = await api.get(`/lab/${workspaceId}`);

  return response.data.payload as LabWithMembers[];
};

export const getAnswer = async (
  query: string,
  labId: string,
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

//* --- SHAPE API CALLS ---

export const createShape = async (labId: string, shape: DBShape) => {
  const response = await api.post(`/lab/${labId}/shapes`, shape);
  return response.data.payload;
};

export const updateShape = async (
  labId: string,
  shapeId: string,
  patch: Partial<DBShape>,
) => {
  const response = await api.put(`/lab/${labId}/shapes/${shapeId}`, patch);
  return response.data.payload;
};

export const batchUpdateShapes = async (
  data: BatchUpdateShapes,
): Promise<{
  applied: {
    shapeId: string;
    commitVersion: number;
  }[];
  rejected: {
    shapeId: string;
    reason: string;
  }[];
}> => {
  const response = await api.post(`/lab/${data.labSlug}/shapes/batch`, data);
  return response.data.payload;
};

export const deleteShape = async (labSlug: string, shapeId: string) => {
  const response = await api.delete(`/lab/${labSlug}/shapes/${shapeId}`);
  return response.data.payload;
};

//* --- SNAPSHOT API CALLS ---

export const getSnapshot = async (labSlug: string): Promise<GetSnapshot> => {
  const response = await api.get(`/lab/${labSlug}/shapes`);
  return response.data.payload;
};

//* --- VIEW API CALLS ---

export const getView = async (labSlug: string) => {
  const response = await api.get(`/lab/${labSlug}/view`);
  return response.data.payload;
};

export const upsertView = async (labSlug: string, viewData: UpsertView) => {
  const response = await api.post(`/lab/${labSlug}/view`, viewData);
  return response.data.payload;
};

//* --- DASHBOARD API CALLS ---

export const getOverview = async (
  slug: string,
): Promise<GetOverviewResponse> => {
  const response = await api.get(`/lab/${slug}/dashboard/overview`);
  return response.data.payload;
};
