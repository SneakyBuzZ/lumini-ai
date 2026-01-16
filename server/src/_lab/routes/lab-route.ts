import { authenticateJwt } from "@/middlewares/authenticate-middleware";
import { Router } from "express";
import { createLabDTO, shapeDTO } from "@/_lab/dto";
import { LabController } from "@/_lab/controllers/lab-controller";
import { validateData } from "@/middlewares/validate-middleware";

const labRouter = Router();

const labController = new LabController();

labRouter.post("/", validateData(createLabDTO), labController.create);

labRouter.get("/:workspaceId", labController.getAll);

labRouter.post(
  "/:labId/shapes",
  validateData(shapeDTO),
  labController.createShape
);
labRouter.get("/:labId/shapes", labController.getAllShapes);

export default labRouter;
