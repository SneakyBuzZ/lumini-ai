import { AppError } from "@/utils/error";
import { UpdateWorkspaceInviteDTOType } from "../dto";
import { WorkspaceRepository } from "../repositories/workspace-repository";
import { WorkspaceMembersRepository } from "../repositories/workspace-members-repository";
import { WorkspaceInvitesRepository } from "../repositories/workspace-invites-repository";
import { sendWorkspaceInviteEmail } from "@/utils/mailer";
import { db } from "@/lib/config/db-config";
import { UserRepository } from "@/_user/repositories/user-repository";
import crypto from "crypto";

const INVITE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export class WorkspaceInvitesService {
  private workspaceRepository: WorkspaceRepository;
  private workspaceMembersRepository: WorkspaceMembersRepository;
  private workspaceInvitesRepository: WorkspaceInvitesRepository;
  private userRepository: UserRepository;

  constructor() {
    this.workspaceRepository = new WorkspaceRepository();
    this.workspaceMembersRepository = new WorkspaceMembersRepository();
    this.workspaceInvitesRepository = new WorkspaceInvitesRepository();
    this.userRepository = new UserRepository();
  }

  async invite(
    data: UpdateWorkspaceInviteDTOType,
    workspaceId: string,
    inviterId: string,
  ) {
    //*---- Validation and permission checks ----
    const workspace = await this.workspaceRepository.findById(workspaceId);
    if (!workspace) throw new AppError(404, "Workspace not found");

    const { email, role } = data;

    //*---- Check inviter's role and permissions ----
    const inviterRole = await this.workspaceMembersRepository.findRoleById(
      inviterId,
      workspaceId,
    );
    if (!inviterRole)
      throw new AppError(400, "Inviter is not a workspace member");

    if (!this.canAssignRole(inviterRole, role))
      throw new AppError(400, "Cannot assign the specified role");

    //*---- Check if invitee is already a member or has a pending invite ----
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      const isAlreadyMember =
        await this.workspaceMembersRepository.findIfMember(
          workspaceId,
          existingUser.id,
        );
      if (isAlreadyMember)
        throw new AppError(400, "User is already a workspace member");
    }

    //*---- Create invite and send email ----
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + INVITE_EXPIRY_MS);
    await this.workspaceInvitesRepository.insert({
      workspaceId,
      invitedById: inviterId,
      email,
      role,
      token,
      expiresAt,
    });
    await sendWorkspaceInviteEmail({
      to: email,
      token,
      workspaceName: workspace.name,
    });
  }

  async accept(token: string, userId: string): Promise<string> {
    return db.transaction(async (tx) => {
      //*---- Validate invite token and user ----
      const invite = await this.workspaceInvitesRepository.findByToken(
        token,
        tx,
      );
      if (!invite) throw new AppError(404, "Invalid invite token");
      if (invite.acceptedAt)
        throw new AppError(400, "Invite has already been accepted");
      if (invite.expiresAt < new Date())
        throw new AppError(400, "Invite has expired");

      //*---- Validate user and email match ----
      const user = await this.userRepository.findById(userId, tx);
      if (!user) throw new AppError(404, "User not found");
      if (user.email !== invite.email)
        throw new AppError(400, "User email does not match invite email");

      //*---- Check if user is already a member ----
      const existingMember = await this.workspaceMembersRepository.findIfMember(
        invite.workspaceId,
        userId,
        tx,
      );
      if (existingMember)
        throw new AppError(400, "User is already a workspace member");

      //*---- Add user to workspace and mark invite as accepted ----
      await this.workspaceMembersRepository.insert(
        invite.workspaceId,
        userId,
        invite.role,
        tx,
      );
      await this.workspaceInvitesRepository.markAccepted(invite.id, tx);
      return invite.workspaceId;
    });
  }

  canAssignRole(inviterRole: string, targetRole: string) {
    if (inviterRole === "owner") return true;
    if (inviterRole === "administrator") {
      return targetRole === "developer";
    }
    return false;
  }
}
