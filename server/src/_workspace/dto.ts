import z from "zod";

export const SaveWorkspaceDTO = z.object({
  name: z.string().min(2).max(100),
  plan: z.enum(["free", "pro", "enterprise"]),
});

export type SaveWorkspaceDTOType = z.infer<typeof SaveWorkspaceDTO>;

export const UpdateWorkspaceDetailsDTO = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(255).optional(),
  logoUrl: z.string().url().optional(),
});

export type UpdateWorkspaceDetailsDTOType = z.infer<
  typeof UpdateWorkspaceDetailsDTO
>;

export const UpdateWorkspaceVisibilityDTO = z.object({
  visibility: z.enum(["public", "private"]),
});

export type UpdateWorkspaceVisibilityDTOType = z.infer<
  typeof UpdateWorkspaceVisibilityDTO
>;

export const UpdateWorkspaceLanguageDTO = z.object({
  defaultLanguage: z.string().min(2).max(10),
});

export type UpdateWorkspaceLanguageDTOType = z.infer<
  typeof UpdateWorkspaceLanguageDTO
>;

export const UpdateWorkspaceNotificationsDTO = z.object({
  notificationsEnabled: z.boolean(),
});

export type UpdateWorkspaceNotificationsDTOType = z.infer<
  typeof UpdateWorkspaceNotificationsDTO
>;

export const UpdateWorkspaceInviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["owner", "administrator", "developer"]),
});

export type UpdateWorkspaceInviteDTOType = z.infer<
  typeof UpdateWorkspaceInviteSchema
>;
