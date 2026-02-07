import { Request, Response } from "express";
import { LabService } from "../services/lab-service";
import { LabSettingsService } from "../services/lab-settings-service";
import { DataResponse } from "@/utils/dto";

export class LabSettingsController {
  private labSettingsService: LabSettingsService;

  constructor() {
    this.labSettingsService = new LabSettingsService();
  }

  getSettings = async (req: Request, res: Response) => {
    const labSlug = req.params.slug;
    const result = await this.labSettingsService.findSettings(labSlug);
    res
      .status(200)
      .json(
        new DataResponse(200, result, "Lab settings retrieved successfully."),
      );
  };

  updateGeneralSettings = async (req: Request, res: Response) => {
    const labSlug = req.params.slug;
    await this.labSettingsService.updateGeneralSettings(labSlug, req.body);
    res
      .status(200)
      .json(
        new DataResponse(200, "Lab general settings updated successfully."),
      );
  };
}
