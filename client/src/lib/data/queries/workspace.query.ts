import { useQuery } from "@tanstack/react-query";
import { getAllWorkspaces } from "../api/workspace.api";

export const useGetAllWorkspaces = () => {
  return useQuery({
    queryKey: ["all_workspaces"],
    queryFn: getAllWorkspaces,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
