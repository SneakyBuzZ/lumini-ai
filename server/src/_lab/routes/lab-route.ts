import { authenticateJwt } from "@/middlewares/authenticate-middleware";
import { Router } from "express";
import { createLabDTO, shapeDTO } from "@/_lab/dto";
import { LabController } from "@/_lab/controllers/lab-controller";
import { validateData } from "@/middlewares/validate-middleware";

const labRouter = Router();

const labController = new LabController();

labRouter.post(
  "/",
  authenticateJwt(),
  validateData(createLabDTO),
  labController.create
);

labRouter.get("/:workspaceId", authenticateJwt(), labController.getAll);

labRouter.post(
  "/:labId/shapes",
  authenticateJwt(),
  validateData(shapeDTO),
  labController.createShape
);
labRouter.get("/:labId/shapes", authenticateJwt(), labController.getAllShapes);

export default labRouter;
