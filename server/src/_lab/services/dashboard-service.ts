import { AppError } from "@/utils/error";
import { DashboardRepository } from "../repositories/dashboard-repository";
import { LabService } from "./lab-service";
import { buildOverview, getLanguages } from "@/lib/github/actions";
import { enqueueRefreshRepoOverview } from "@/lib/github/queue";
import { OverviewData } from "../dto";

export class DashboardService {
  private dashboardRepository: DashboardRepository;
  private labService: LabService;

  constructor() {
    this.dashboardRepository = new DashboardRepository();
    this.labService = new LabService();
  }

  async getOverview(labId: string) {
    const lab = await this.labService.findById(labId);
    if (!lab) throw new AppError(404, "Lab not found");

    const overview = await this.dashboardRepository.findOverviewByLabId(labId);
    if (!overview) {
      const overviewData = await buildOverview(lab.githubUrl);
      return await this.dashboardRepository.upsertOverview(labId, overviewData);
    }

    const isStale =
      !overview.refreshedAt ||
      Date.now() - overview.refreshedAt.getTime() > 24 * 60 * 60 * 1000;
    if (isStale) {
      enqueueRefreshRepoOverview(labId, this.refreshOverview.bind(this));
    }

    return overview;
  }

  async refreshOverview(labId: string) {
    const lab = await this.labService.findById(labId);
    if (!lab) throw new AppError(404, "Lab not found");
    const overviewData = await buildOverview(lab.githubUrl);
    await this.dashboardRepository.upsertOverview(labId, overviewData);
  }
}
