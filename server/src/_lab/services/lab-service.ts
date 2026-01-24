import { LabRepository } from "@/_lab/repositories/lab-repository";
import { CreateLabDTO } from "@/_lab/dto";
import { WorkspaceRepository } from "@/_workspace/repositories/workspace-repository";
import { AppError } from "@/utils/error";
import { getLanguages } from "@/lib/github/actions";

export class LabService {
  private labRepository: LabRepository;
  private workspaceRepository: WorkspaceRepository;

  constructor() {
    this.labRepository = new LabRepository();
    this.workspaceRepository = new WorkspaceRepository();
  }

  async create(data: CreateLabDTO, creatorId: string) {
    const role = await this.workspaceRepository.findMemberRoleById(
      creatorId,
      data.workspaceId,
    );
    if (!role) throw new AppError(403, "Unauthorized");

    if (role !== "administrator" && role !== "owner") {
      throw new AppError(
        403,
        "You are not allowed to create labs in this workspace",
      );
    }

    const config = this.workspaceRepository.workspaceConfig[data.plan];
    const labCount = await this.labRepository.countLabs(data.workspaceId);

    if (labCount >= config.labsLimit)
      throw new AppError(403, "Lab limit reached");

    const labId = await this.labRepository.save(data, creatorId);
    return labId;
  }

  async findAll(workspaceId: string) {
    return await this.labRepository.findAll(workspaceId);
  }

  async findById(labId: string) {
    return await this.labRepository.findById(labId);
  }

  async getLabLanguages(labId: string) {
    const lab = await this.labRepository.findById(labId);
    if (!lab) throw new AppError(404, "Lab not found");
    return getLanguages(lab.githubUrl);
  }
}
