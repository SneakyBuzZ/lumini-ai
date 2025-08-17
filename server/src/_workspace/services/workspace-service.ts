import { WorkspaceRepository } from "@/_workspace/repositories/workspace-repository";
import { SaveWorkspaceDTOType } from "../dto";

export class WorkspaceService {
  workspaceRepository: WorkspaceRepository;

  constructor() {
    this.workspaceRepository = new WorkspaceRepository();
  }

  async create(data: SaveWorkspaceDTOType) {
    await this.workspaceRepository.save(data);
  }

  async findUserWorkspaces(userId: string) {
    return await this.workspaceRepository.findAllAndUser(userId);
  }
}
