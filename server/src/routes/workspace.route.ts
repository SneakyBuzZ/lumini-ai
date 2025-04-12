import { validateData } from "@/middlewares/validate.middleware";
import { createWorkspaceSchema } from "@/schemas/workspace.schema";
import { Router } from "express";
import workspaceController from "@/controllers/workspace.controller";
import { authenticateJwt } from "@/middlewares/authenticate.middleware";

const workspaceRouter = Router();

workspaceRouter.post(
  "/",
  authenticateJwt(),
  validateData(createWorkspaceSchema),
  workspaceController.create
);

workspaceRouter.get("/", authenticateJwt(), workspaceController.getAll);

export default workspaceRouter;
