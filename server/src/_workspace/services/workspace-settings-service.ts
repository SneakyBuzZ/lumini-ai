import { AppError } from "@/utils/error";
import { WorkspaceRepository } from "../repositories/workspace-repository";
import { WorkspaceSettingsRepository } from "../repositories/workspace-settings-repository";
import {
  UpdateWorkspaceGeneralDTOType,
  UpdateWorkspacePreferencesDTOType,
} from "../dto";

export class WorkspaceSettingsService {
  private workspaceRepository: WorkspaceRepository;
  private workspaceSettingsRepository: WorkspaceSettingsRepository;

  constructor() {
    this.workspaceRepository = new WorkspaceRepository();
    this.workspaceSettingsRepository = new WorkspaceSettingsRepository();
  }

  async findGeneral(slug: string | null) {
    if (!slug) throw new AppError(400, "Workspace slug is required");
    const workspace = await this.workspaceRepository.findBySlug(slug);
    if (!workspace) throw new AppError(404, "Workspace not found");
    const workspaceId = workspace.id;
    const settings =
      await this.workspaceSettingsRepository.findGeneral(workspaceId);
    return settings;
  }

  async updateGeneral(data: UpdateWorkspaceGeneralDTOType, slug: string) {
    const workspace = await this.workspaceRepository.findBySlug(slug);
    if (!workspace) throw new AppError(404, "Workspace not found");
    await this.workspaceSettingsRepository.updateGeneral(data, workspace.id);
  }

  async updatePreferences(
    data: UpdateWorkspacePreferencesDTOType,
    slug: string,
  ) {
    const workspace = await this.workspaceRepository.findBySlug(slug);
    if (!workspace) throw new AppError(404, "Workspace not found");
    await this.workspaceSettingsRepository.updatePreferences(
      data,
      workspace.id,
    );
  }
}
