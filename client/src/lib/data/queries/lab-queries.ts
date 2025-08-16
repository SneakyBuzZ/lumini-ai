import { useQuery } from "@tanstack/react-query";
import { getAll, getLabsByWorkspaceId } from "../api/lab-api.js";

export const useGetAllLabs = () => {
  return useQuery({
    queryKey: ["getAllLabs"],
    queryFn: getAll,
    retry: 1,
    staleTime: 1000 * 60 * 3,
  });
};

export const useGetLabsByWorkspaceId = (workspaceId: string) => {
  return useQuery({
    queryKey: ["getLabsByWorkspaceId", workspaceId],
    queryFn: ({ queryKey }) => getLabsByWorkspaceId(queryKey[1] as string),
    retry: 1,
    staleTime: 1000 * 60,
  });
};
