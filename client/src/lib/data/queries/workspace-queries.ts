import { useQuery } from "@tanstack/react-query";
import {
  getAllWorkspaces,
  getWorkspaceSettings,
} from "@/lib/data/api/workspace-api";
import useWorkspacesStore from "@/lib/store/workspace-store";

export const useGetAllWorkspaces = () => {
  return useQuery({
    queryKey: ["all_workspaces"],
    queryFn: getAllWorkspaces,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useGetWorkspaceWithStore = () => {
  const { setWorkspaces, setCurrentWorkspace } = useWorkspacesStore.getState();

  return useQuery({
    queryKey: ["getAllWorkspacesWithStore"],
    queryFn: async () => {
      const workspaces = (await getAllWorkspaces()) || [];
      setWorkspaces(workspaces);
      const localWorkspace = JSON.parse(
        localStorage.getItem("workspace") || "{}"
      );
      setCurrentWorkspace(
        localWorkspace || workspaces[workspaces.length - 1] || null
      );
      return workspaces;
    },
    retry: 1,
  });
};

export const useGetWorkspaceSettings = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace_settings", workspaceId],
    queryFn: () => getWorkspaceSettings(workspaceId),
    enabled: !!workspaceId,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
};
