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
    const labId = req.params.labId;
    if (!labId) throw new AppError(400, "Lab ID is required");

    const overview = await this.dashboardService.getOverview(labId);
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
