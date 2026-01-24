import { authenticateJwt } from "@/middlewares/authenticate-middleware";
import { Router } from "express";
import {
  createLabDTO,
  shapeDTO,
  shapeType,
  updateBatchDTo,
  viewDTO,
} from "@/_lab/dto";
import { LabController } from "@/_lab/controllers/lab-controller";
import { validateData } from "@/middlewares/validate-middleware";
import { DashboardController } from "../controllers/dashboard-controller";
import { catchAsync } from "@/utils/catch-async";

const labRouter = Router();

const labController = new LabController();
const dashboardController = new DashboardController();

//^ --- Lab Routes ---
labRouter.post("/", validateData(createLabDTO), labController.create);
labRouter.get("/:workspaceId", labController.getAll);

//^ --- Shape Routes ---
labRouter.post(
  "/:labId/shapes",
  validateData(shapeDTO),
  catchAsync(labController.createShape),
);
labRouter.put(
  "/:labId/shapes/:shapeId",
  validateData(shapeDTO.partial()),
  catchAsync(labController.updateShape),
);
labRouter.get("/:labId/shapes", catchAsync(labController.getAllShapes));
labRouter.delete(
  "/:labId/shapes/:shapeId",
  catchAsync(labController.deleteShape),
);
labRouter.post(
  "/:labId/shapes/batch",
  validateData(updateBatchDTo),
  catchAsync(labController.batchUpdateShapes),
);

//^ --- View Routes ---
labRouter.get("/:labId/view", labController.getView);
labRouter.post(
  "/:labId/view",
  validateData(viewDTO),
  catchAsync(labController.upsertView),
);

//^ --- Dashboard Routes ---
labRouter.get(
  "/:labId/dashboard/overview",
  catchAsync(dashboardController.getOverview),
);

export default labRouter;
