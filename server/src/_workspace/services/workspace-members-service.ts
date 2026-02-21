import { AppError } from "@/utils/error";
import { WorkspaceMembersRepository } from "../repositories/workspace-members-repository";
import { WorkspaceRepository } from "../repositories/workspace-repository";
import { WorkspaceInvitesRepository } from "../repositories/workspace-invites-repository";

export class WorkspaceMembersService {
  private workspaceMembersRepository: WorkspaceMembersRepository;
  private workspaceRepository: WorkspaceRepository;
  private workspaceInvitesRepository: WorkspaceInvitesRepository;

  constructor() {
    this.workspaceMembersRepository = new WorkspaceMembersRepository();
    this.workspaceRepository = new WorkspaceRepository();
    this.workspaceInvitesRepository = new WorkspaceInvitesRepository();
  }

  async findAll(slug: string) {
    const workspace = await this.workspaceRepository.findBySlug(slug);
    if (!workspace) throw new AppError(404, "Workspace not found");
    const members = await this.workspaceMembersRepository.findAll(workspace.id);
    const invites = await this.workspaceInvitesRepository.findAll(workspace.id);
    return [...members, ...invites];
  }
}
