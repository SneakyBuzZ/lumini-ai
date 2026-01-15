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

export class WorkspaceService {
  workspaceRepository: WorkspaceRepository;

  constructor() {
    this.workspaceRepository = new WorkspaceRepository();
  }

  async create(data: SaveWorkspaceDTOType, ownerId: string) {
    if (data.plan === "free") {
      const userWorkspaces = await this.workspaceRepository.findAllAndUser(
        ownerId
      );

      const hasFreePlan = userWorkspaces.some(
        (workspace) => workspace.plan === "free"
      );

      if (hasFreePlan && data.plan === "free") {
        throw new AppError(409, "You can only create one free workspace");
      }
    }

    await this.workspaceRepository.save(data, ownerId);
  }

  async findGeneralSettings(req: Request) {
    const workspaceId = req.params.workspaceId;
    if (!workspaceId) throw new AppError(400, "Workspace ID is required");
    return await this.workspaceRepository.findGeneralSettings(workspaceId);
  }

  async findUserWorkspaces(userId: string) {
    return await this.workspaceRepository.findAllAndUser(userId);
  }

  async findAllMembers(workspaceId: string) {
    return await this.workspaceRepository.findAllMembers(workspaceId);
  }

  async updateDetails(
    data: UpdateWorkspaceDetailsDTOType,
    workspaceId: string
  ) {
    await this.workspaceRepository.updateDetails(data, workspaceId);
  }

  async updateVisibility(
    data: UpdateWorkspaceVisibilityDTOType,
    workspaceId: string
  ) {
    await this.workspaceRepository.updateVisibility(data, workspaceId);
  }

  async updateLanguage(
    data: UpdateWorkspaceLanguageDTOType,
    workspaceId: string
  ) {
    await this.workspaceRepository.updateLanguage(data, workspaceId);
  }

  async updateNotifications(
    data: UpdateWorkspaceNotificationsDTOType,
    workspaceId: string
  ) {
    await this.workspaceRepository.updateNotificationsEnabled(
      data,
      workspaceId
    );
  }

  async inviteMember(
    data: UpdateWorkspaceInviteDTOType,
    workspaceId: string,
    inviterId: string
  ) {
    console.log("DATA: ", data);
    const workspace = await this.workspaceRepository.findById(workspaceId);
    if (!workspace) throw new AppError(404, "Workspace not found");

    const { email, role } = data;
    console.log("Inviting member:", email, "with role:", role);
    const inviterRole = await this.workspaceRepository.findMemberRoleById(
      inviterId
    );
    const recipientRole = await this.workspaceRepository.findMemberRoleByEmail(
      email
    );

    console.log("Inviter Role:", inviterRole);
    console.log("Recipient Role:", recipientRole);

    if (!inviterRole) throw new Error("Inviter role not found");
    if (recipientRole) throw new Error("User is already a workspace member");
    if (!this.workspaceRepository.canAssignRole(inviterRole, role))
      throw new Error("Cannot assign the specified role");

    const invite = await this.workspaceRepository.createInvite(
      data,
      workspaceId,
      inviterId
    );
    console.log("Invite created with token:", invite);

    await sendWorkspaceInviteEmail({
      to: email,
      token: invite.token,
      workspaceName: workspace.name,
    });
  }
}
