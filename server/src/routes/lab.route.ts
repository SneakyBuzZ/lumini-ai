import { validateData } from "@/middlewares/validate.middleware";
import labController from "@/controllers/lab.controller";
import { Router } from "express";
import { createLabSchema } from "@/schemas/lab.schema";
import { authenticateJwt } from "@/middlewares/authenticate.middleware";

const labRouter = Router();

labRouter.post(
  "/",
  authenticateJwt(),
  validateData(createLabSchema),
  labController.create
);

labRouter.get("/", authenticateJwt(), labController.getAll);

labRouter.get(
  "/:workspaceId",
  authenticateJwt(),
  labController.getLabsByWorkspaceId
);

labRouter.post(
  "/ask/:labId",
  authenticateJwt(),
  labController.getAnswerToQuery
);

export default labRouter;
