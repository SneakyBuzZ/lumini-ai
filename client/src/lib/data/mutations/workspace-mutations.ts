import { useMutation } from "@tanstack/react-query";
import { createWorkspace } from "@/lib/data/api/workspace-api";
import { AxiosError } from "axios";

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
