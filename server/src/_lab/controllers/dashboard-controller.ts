import { Request, Response } from "express";
import { DashboardService } from "../services/dashboard-service";
import { LabService } from "../services/lab-service";
import { AppError } from "@/utils/error";
import { DataResponse } from "@/utils/dto";

export class DashboardController {
  private labService: LabService;
  private dashboardService: DashboardService;

  constructor() {
    this.labService = new LabService();
    this.dashboardService = new DashboardService();
  }

  getOverview = async (req: Request, res: Response) => {
    const slug = req.params.slug;
    if (!slug) throw new AppError(400, "Slug is required");

    const overview = await this.dashboardService.getOverview(slug);
    res.status(200).json(
      new DataResponse(
        200,
        {
          ...overview,
          architecture: (overview.architecture as { data: any }).data,
        },
        "Overview retrieved successfully.",
      ),
    );
  };
}
