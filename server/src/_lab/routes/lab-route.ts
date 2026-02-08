import { Router } from "express";
import {
  createLabDTO,
  UpdateAISettingsDTO,
  updateBatchDTo,
  UpdateGeneralDTO,
  viewDTO,
} from "@/_lab/dto";
import { LabController } from "@/_lab/controllers/lab-controller";
import { validateData } from "@/middlewares/validate-middleware";
import { DashboardController } from "../controllers/dashboard-controller";
import { catchAsync } from "@/utils/catch-async";
import { LabSettingsController } from "../controllers/lab-settings-controller";

const labRouter = Router();

const labController = new LabController();
const dashboardController = new DashboardController();
const labSettingsController = new LabSettingsController();

//^ --- Lab Routes ---
labRouter.post(
  "/",
  validateData(createLabDTO),
  catchAsync(labController.create),
);
labRouter.get("/:slug", catchAsync(labController.getBySlug));
labRouter.get("/:slug/workspace/all", catchAsync(labController.getAll));
labRouter.get("/:slug/settings", catchAsync(labSettingsController.getSettings));
labRouter.put(
  "/:slug/settings/general",
  validateData(UpdateGeneralDTO),
  catchAsync(labSettingsController.updateGeneralSettings),
);
labRouter.put(
  "/:slug/settings/ai",
  validateData(UpdateAISettingsDTO),
  catchAsync(labSettingsController.updateAISettings),
);
labRouter.get(
  "/:slug/ai/config",
  catchAsync(labSettingsController.getAIConfig),
);
labRouter.get("/:slug/workspace", catchAsync(labController.getWorkspaceId));

//^ --- Shape Routes ---
labRouter.get("/:slug/shapes", catchAsync(labController.getAllShapes));

labRouter.post(
  "/:slug/shapes/batch",
  validateData(updateBatchDTo),
  catchAsync(labController.batchUpdateShapes),
);

//^ --- View Routes ---
labRouter.get("/:slug/view", catchAsync(labController.getView));
labRouter.post(
  "/:slug/view",
  validateData(viewDTO),
  catchAsync(labController.upsertView),
);

//^ --- Dashboard Routes ---
labRouter.get(
  "/:slug/dashboard/overview",
  catchAsync(dashboardController.getOverview),
);

export default labRouter;
