import { authenticateJwt } from "@/middlewares/authenticate-middleware";
import { validateData } from "@/middlewares/validate-middleware";
import { Router } from "express";
import { SaveWorkspaceDTO } from "@/_workspace/dto";
import { WorkspaceController } from "@/_workspace/controllers/workspace-controller";
import { catchAsync } from "@/utils/catch-async";

const workspaceRouter = Router();

const workspaceController = new WorkspaceController();

workspaceRouter.post(
  "/",
  authenticateJwt(),
  validateData(SaveWorkspaceDTO),
  catchAsync(workspaceController.create)
);

workspaceRouter.get(
  "/",
  authenticateJwt(),
  workspaceController.findUserWorkspaces
);

workspaceRouter.get(
  "/:workspaceId/members",
  authenticateJwt(),
  workspaceController.findAllMembers
);

export default workspaceRouter;
