import { WorkspaceRepository } from "@/_workspace/repositories/workspace-repository";
import {
  SaveWorkspaceDTOType,
  UpdateWorkspaceDetailsDTOType,
  UpdateWorkspaceInviteDTOType,
  UpdateWorkspaceLanguageDTOType,
  UpdateWorkspaceNotificationsDTOType,
  UpdateWorkspaceVisibilityDTOType,
} from "@/_workspace/dto";
import { AppError } from "@/utils/error";
import { Request } from "express";
import { sendWorkspaceInviteEmail } from "@/utils/mailer";
import { UserRepository } from "@/_user/repositories/user-repository";
import { db } from "@/lib/config/db-config";

export class WorkspaceService {
  workspaceRepository: WorkspaceRepository;
  userRepository: UserRepository;

  constructor() {
    this.workspaceRepository = new WorkspaceRepository();
    this.userRepository = new UserRepository();
  }

  async create(data: SaveWorkspaceDTOType, ownerId: string) {
    if (data.plan === "free") {
      const userWorkspaces = await this.workspaceRepository.findAll(ownerId);

      const hasFreePlan = userWorkspaces.some(
        (workspace) => workspace.plan === "free",
      );

      if (hasFreePlan && data.plan === "free") {
        throw new AppError(409, "You can only create one free workspace");
      }
    }

    await this.workspaceRepository.save(data, ownerId);
  }

  async findBySlug(slug: string) {
    const workspace = await this.workspaceRepository.findBySlug(slug);
    if (!workspace) throw new AppError(404, "Workspace not found");
    return workspace;
  }

  async findGeneralSettings(slug: string | null) {
    if (!slug) throw new AppError(400, "Workspace slug is required");
    const workspace = await this.workspaceRepository.findBySlug(slug);
    if (!workspace) throw new AppError(404, "Workspace not found");
    const workspaceId = workspace.id;
    return await this.workspaceRepository.findGeneralSettings(workspaceId);
  }

  async findUserWorkspaces(userId: string) {
    return await this.workspaceRepository.findAllWithInvited(userId);
  }

  async findAllMembers(slug: string | undefined) {
    if (!slug) throw new AppError(400, "Workspace slug is required");
    const workspace = await this.workspaceRepository.findBySlug(slug);
    console.log("Workspace in service:", workspace.id);
    if (!workspace) throw new AppError(404, "Workspace not found");
    const members = await this.workspaceRepository.findAllMembers(workspace.id);
    const invitedMembers = await this.workspaceRepository.findAllInvitedMembers(
      workspace.id,
    );
    return [...members, ...invitedMembers];
  }

  async updateDetails(
    data: UpdateWorkspaceDetailsDTOType,
    workspaceId: string,
  ) {
    await this.workspaceRepository.updateDetails(data, workspaceId);
  }

  async updateVisibility(
    data: UpdateWorkspaceVisibilityDTOType,
    workspaceId: string,
  ) {
    await this.workspaceRepository.updateVisibility(data, workspaceId);
  }

  async updateLanguage(
    data: UpdateWorkspaceLanguageDTOType,
    workspaceId: string,
  ) {
    await this.workspaceRepository.updateLanguage(data, workspaceId);
  }

  async updateNotifications(
    data: UpdateWorkspaceNotificationsDTOType,
    workspaceId: string,
  ) {
    await this.workspaceRepository.updateNotificationsEnabled(
      data,
      workspaceId,
    );
  }

  async inviteMember(
    data: UpdateWorkspaceInviteDTOType,
    workspaceId: string,
    inviterId: string,
  ) {
    const workspace = await this.workspaceRepository.findById(workspaceId);
    if (!workspace) throw new AppError(404, "Workspace not found");

    const { email, role } = data;
    const inviterRole = await this.workspaceRepository.findMemberRoleById(
      inviterId,
      workspaceId,
    );
    const recipientRole =
      await this.workspaceRepository.findMemberRoleByEmail(email);

    if (!inviterRole) throw new Error("Inviter role not found");
    if (recipientRole) throw new Error("User is already a workspace member");
    if (!this.workspaceRepository.canAssignRole(inviterRole, role))
      throw new Error("Cannot assign the specified role");

    const invite = await this.workspaceRepository.createInvite(
      data,
      workspaceId,
      inviterId,
    );

    await sendWorkspaceInviteEmail({
      to: email,
      token: invite.token,
      workspaceName: workspace.name,
    });
  }

  async acceptInvite(token: string, userId: string): Promise<string> {
    return await db.transaction(async (tx) => {
      const invite = await this.workspaceRepository.findInvite(token, tx);

      if (!invite) throw new AppError(404, "Invalid invite token");

      if (invite.acceptedAt)
        throw new AppError(400, "Invite has already been accepted");

      if (invite.expiresAt < new Date())
        throw new AppError(400, "Invite has expired");

      const user = await this.userRepository.findById(userId, tx);
      if (!user) throw new AppError(404, "User not found");

      if (user.email !== invite.email)
        throw new AppError(400, "User email does not match invite email");

      const existingMember = await this.workspaceRepository.findIfMember(
        invite.workspaceId,
        userId,
        tx,
      );
      if (existingMember)
        throw new AppError(400, "User is already a workspace member");

      await this.workspaceRepository.acceptInvite(
        userId,
        invite.workspaceId,
        invite.role,
        tx,
      );

      return invite.workspaceId;
    });
  }
}
