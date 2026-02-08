import { AppError } from "@/utils/error";
import { LabRepository } from "@/_lab/repositories/lab-repository";
import { LabSettingsRepository } from "@/_lab/repositories/lab-settings-repository";
import { UpdateAISettingsType, UpdateGeneralType } from "../dto";

export class LabSettingsService {
  private labSettingsRepository: LabSettingsRepository;
  private labRepository: LabRepository;

  constructor() {
    this.labRepository = new LabRepository();
    this.labSettingsRepository = new LabSettingsRepository();
  }

  async findSettings(labSlug: string | null) {
    if (!labSlug) throw new AppError(400, "Lab slug is required");
    const lab = await this.labRepository.findBySlug(labSlug);
    if (!lab) throw new AppError(404, "Lab not found");
    return await this.labSettingsRepository.findSettings(lab.id);
  }

  async updateGeneralSettings(labSlug: string, data: UpdateGeneralType) {
    const lab = await this.labRepository.findBySlug(labSlug);
    if (!lab) throw new AppError(404, "Lab not found");
    await this.labSettingsRepository.updateGeneralSettings(lab.id, data);
  }

  async findAIConfig(labSlug: string) {
    const lab = await this.labRepository.findBySlug(labSlug);
    if (!lab) throw new AppError(404, "Lab not found");
    return await this.labSettingsRepository.findAIConfig(lab.id);
  }

  async updateAISettings(labSlug: string, data: UpdateAISettingsType) {
    const lab = await this.labRepository.findBySlug(labSlug);
    if (!lab) throw new AppError(404, "Lab not found");
    await this.labSettingsRepository.updateAIConfig(lab.id, data);
  }
}
