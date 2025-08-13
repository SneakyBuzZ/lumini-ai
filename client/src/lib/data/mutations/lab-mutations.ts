import { useMutation } from "@tanstack/react-query";
import { create } from "../api/lab-api.js";
import { CreateLab } from "../types/lab-types";

export const useCreateLab = () => {
  return useMutation({
    mutationFn: (payload: CreateLab) => create(payload),
  });
};
