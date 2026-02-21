import { WorkspaceRepository } from "@/_workspace/repositories/workspace-repository";
import { SaveWorkspaceDTOType } from "@/_workspace/dto";
import { AppError } from "@/utils/error";
import { UserRepository } from "@/_user/repositories/user-repository";
import { WorkspaceSettingsRepository } from "../repositories/workspace-settings-repository";

export class WorkspaceService {
  workspaceRepository: WorkspaceRepository;
  workspaceSettingsRepository: WorkspaceSettingsRepository;
  userRepository: UserRepository;

  constructor() {
    this.workspaceRepository = new WorkspaceRepository();
    this.workspaceSettingsRepository = new WorkspaceSettingsRepository();
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

  async findUserWorkspaces(userId: string) {
    return await this.workspaceRepository.findAllWithInvited(userId);
  }
}
