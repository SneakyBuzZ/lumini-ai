import { useQuery } from "@tanstack/react-query";
import { getAllLabs, getSnapshot } from "@/lib/api/lab-api";
import {
  getAllWorkspaces,
  getWorkspaceMembers,
  getWorkspaceSettings,
} from "@/lib/api/workspace-api";
import { WorkspaceSettingsMap } from "@/lib/types/workspace-type";

export const useGetLabs = (workspaceId: string) => {
  return useQuery({
    queryKey: ["labs", workspaceId],
    queryFn: () => getAllLabs(workspaceId),
  });
};

export const useGetWorkspaces = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: () => getAllWorkspaces(),
  });
};

export const useGetWorkspaceSettings = <T extends keyof WorkspaceSettingsMap>(
  workspaceId: string,
  settingType: T
) => {
  return useQuery<WorkspaceSettingsMap[T]>({
    queryKey: ["workspace-settings", workspaceId, settingType],
    queryFn: () => getWorkspaceSettings(settingType, workspaceId),
  });
};

export const useGetWorkspaceMembers = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace-members", workspaceId],
    queryFn: () => getWorkspaceMembers(workspaceId),
  });
};

export const useGetSnapshot = (labId: string) => {
  return useQuery({
    queryKey: ["lab-snapshot", labId],
    queryFn: () => getSnapshot(labId),
  });
};
