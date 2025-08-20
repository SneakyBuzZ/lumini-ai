import { authenticateJwt } from "@/middlewares/authenticate-middleware";
import { Router } from "express";
import { createLabDTO } from "@/_lab/dto";
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

// labRouter.get(
//   "/:workspaceId",
//   authenticateJwt(),
//   labController.getLabsByWorkspaceId
// );

// labRouter.post(
//   "/ask/:labId",
//   authenticateJwt(),
//   labController.getAnswerToQuery
// );

export default labRouter;
