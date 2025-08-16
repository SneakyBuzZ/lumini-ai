import { validateData } from "@/middlewares/validate-middleware";
import labController from "@/_lab/lab-controller";
import { Router } from "express";
import { createLabSchema } from "@/_lab/lab-schema";
import { authenticateJwt } from "@/middlewares/authenticate-middleware";

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
