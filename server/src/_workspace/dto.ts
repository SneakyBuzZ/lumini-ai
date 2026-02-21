import z from "zod";

//* ================== WORKSPACE DTOS ================== *//

export const SaveWorkspaceDTO = z.object({
  name: z.string().min(2).max(100),
  plan: z.enum(["free", "pro", "enterprise"]),
  type: z.enum(["personal", "team"]),
});

export type SaveWorkspaceDTOType = z.infer<typeof SaveWorkspaceDTO>;

export const UpdateWorkspaceGeneralDTO = z.object({
  name: z.string().min(2).max(100).optional(),
});

export type UpdateWorkspaceGeneralDTOType = z.infer<
  typeof UpdateWorkspaceGeneralDTO
>;

export const UpdateWorkspacePreferencesDTO = z.object({
  visibility: z.enum(["public", "private"]).optional(),
  defaultLanguage: z.string().optional(),
  notificationsEnabled: z.boolean().optional(),
});

export type UpdateWorkspacePreferencesDTOType = z.infer<
  typeof UpdateWorkspacePreferencesDTO
>;

export const UpdateWorkspaceInviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["owner", "admin", "member"]),
});

export type UpdateWorkspaceInviteDTOType = z.infer<
  typeof UpdateWorkspaceInviteSchema
>;

export const AcceptWorkspaceInviteDTO = z.object({
  token: z.string().min(10),
});
export type AcceptWorkspaceInviteDTOType = z.infer<
  typeof AcceptWorkspaceInviteDTO
>;
