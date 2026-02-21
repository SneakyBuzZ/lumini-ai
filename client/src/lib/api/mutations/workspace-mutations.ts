import { useMutation } from "@tanstack/react-query";
import {
  updateWorkspaceGeneralSettings,
  updateWorkspacePreferences,
} from "../workspace-api";
import { UpdateGeneralSettings, UpdatePreferences } from "../dto/workspace-dto";

export const useUpdateGeneral = () => {
  return useMutation({
    mutationFn: (data: { settings: UpdateGeneralSettings; slug: string }) =>
      updateWorkspaceGeneralSettings(data.settings, data.slug),
  });
};

export const useUpdatePreferences = () => {
  return useMutation({
    mutationFn: (data: { preferences: UpdatePreferences; slug: string }) =>
      updateWorkspacePreferences(data.preferences, data.slug),
  });
};
