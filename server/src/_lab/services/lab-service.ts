import { LabRepository } from "@/_lab/repositories/lab-repository";
import { CreateLabDTO } from "@/_lab/dto";
import { WorkspaceRepository } from "@/_workspace/repositories/workspace-repository";
import { AppError } from "@/utils/error";
import axios from "axios";
import { AI_SERVER_URL } from "@/utils/constants";

export class LabService {
  private labRepository: LabRepository;
  private workspaceRepository: WorkspaceRepository;

  constructor() {
    this.labRepository = new LabRepository();
    this.workspaceRepository = new WorkspaceRepository();
  }

  async create(data: CreateLabDTO, creatorId: string) {
    const membership = await this.workspaceRepository.findMemberRoleById(
      creatorId
    );

    if (!membership) {
      throw new AppError(403, "You are not a member of this workspace");
    }

    if (membership.role !== "administrator" && membership.role !== "owner") {
      throw new AppError(
        403,
        "You are not allowed to create labs in this workspace"
      );
    }

    const config = this.workspaceRepository.workspaceConfig[data.plan];

    const labCount = await this.labRepository.countLabs(data.workspaceId);

    if (labCount >= config.labsLimit)
      throw new AppError(403, "Lab limit reached");

    const labId = await this.labRepository.save(data, creatorId);
    return labId;
  }

  async findAll(workspaceId: string, userId: string) {
    return await this.labRepository.findAll(workspaceId, userId);
  }
}
