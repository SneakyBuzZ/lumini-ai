import { useQuery } from "@tanstack/react-query";
import { getAllWorkspaces } from "@/lib/api/workspace-api";
import useAppStore from "@/lib/store/project-store";
import { getAllLabs } from "@/lib/api/lab-api";

export const useGetWorkspaces = () => {
  const { setWorkspaces, setCurrentWorkspace, setLabs } = useAppStore();
  return useQuery({
    queryKey: ["workspaces-labs"],
    queryFn: async () => {
      const workspaces = await getAllWorkspaces();
      setWorkspaces(workspaces);
      setCurrentWorkspace(workspaces[0]);
      const labs = await getAllLabs(workspaces[0].id);
      setLabs(labs);
      return { workspaces, labs };
    },
    retry: 2,
  });
};
