import { WorkspaceRepository } from "@/_workspace/repositories/workspace-repository";
import { SaveWorkspaceDTOType } from "../dto";
import { AppError } from "@/utils/error";

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

  async findUserWorkspaces(userId: string) {
    return await this.workspaceRepository.findAllAndUser(userId);
  }

  async findAllMembers(workspaceId: string) {
    return await this.workspaceRepository.findAllMembers(workspaceId);
  }
}
