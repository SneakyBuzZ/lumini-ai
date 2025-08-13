import { useMutation } from "@tanstack/react-query";
import { create } from "../api/lab.api";
import { CreateLab } from "../types/lab.type";

export const useCreateLab = () => {
  return useMutation({
    mutationFn: (payload: CreateLab) => create(payload),
  });
};
