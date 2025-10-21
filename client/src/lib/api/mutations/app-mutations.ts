import { useMutation } from "@tanstack/react-query";
import { CreateLab } from "@/lib/api/dto";
import { create } from "@/lib/api/lab-api";
import { AxiosError } from "axios";
import { createWorkspace } from "@/lib/api/workspace-api";

export const useCreateLab = (setError: (error: string | null) => void) => {
  return useMutation({
    mutationFn: (payload: CreateLab) => create(payload),
    onError: (error) => {
      if (error instanceof AxiosError) {
        setError(
          error.response?.data.messages || "An unexpected error occurred"
        );
      }
    },
    onSuccess: () => {
      window.location.reload();
    },
  });
};

export const useCreateWorksace = (setError: (error: string) => void) => {
  return useMutation({
    mutationFn: (payload: {
      name: string;
      plan: "free" | "pro" | "enterprise";
    }) => createWorkspace(payload),
    onError: (error) => {
      if (error instanceof AxiosError) {
        setError(error.response?.data.messages);
      }
    },
  });
};
