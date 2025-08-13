import { useMutation } from "@tanstack/react-query";
import { createWorkspace } from "../api/workspace.api";

export const useCreateWorksace = () => {
  return useMutation({
    mutationFn: (payload: {
      name: string;
      plan: "free" | "pro" | "enterprise";
    }) => createWorkspace(payload.name, payload.plan),
  });
};
