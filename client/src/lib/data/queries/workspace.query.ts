import { useQuery } from "@tanstack/react-query";
import { getAllWorkspaces } from "../api/workspace.api";
import useWorkspacesStore from "@/lib/store/workspace.store";

export const useGetAllWorkspaces = () => {
  return useQuery({
    queryKey: ["all_workspaces"],
    queryFn: getAllWorkspaces,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useWorkspaceWithStore = () => {
  const { setWorkspaces } = useWorkspacesStore.getState();

  return useQuery({
    queryKey: ["getAllWorkspacesWithStore"],
    queryFn: async () => {
      const workspaces = (await getAllWorkspaces()) || [];
      setWorkspaces(workspaces);
      return workspaces;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
