import { Router } from "express";
// import workspaceController from "@/_workspace/controllers/workspace-controller";

const workspaceRouter = Router();

// workspaceRouter.post(
//   "/",
//   authenticateJwt(),
//   validateData(createWorkspaceSchema),
//   workspaceController.create
// );

// workspaceRouter.get("/", authenticateJwt(), workspaceController.getAll);

// workspaceRouter.get(
//   "/settings/:workspaceId",
//   authenticateJwt(),
//   workspaceController.getSettings
// );

export default workspaceRouter;
