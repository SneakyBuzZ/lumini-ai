import { AppError } from "@/utils/error";
import { LabRepository } from "../repositories/lab-repository";
import { LabSettingsRepository } from "../repositories/lab-settings-repository";
import { UpdateGeneralType } from "../dto";

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
}
