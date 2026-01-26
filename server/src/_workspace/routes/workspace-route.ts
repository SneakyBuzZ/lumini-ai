import { authenticateJwt } from "@/middlewares/authenticate-middleware";
import { validateData } from "@/middlewares/validate-middleware";
import { Router } from "express";
import { AcceptWorkspaceInviteDTO, SaveWorkspaceDTO } from "@/_workspace/dto";
import { WorkspaceController } from "@/_workspace/controllers/workspace-controller";
import { catchAsync } from "@/utils/catch-async";

const workspaceRouter = Router();

const workspaceController = new WorkspaceController();

workspaceRouter.post(
  "/",
  validateData(SaveWorkspaceDTO),
  catchAsync(workspaceController.create),
);

workspaceRouter.get("/", catchAsync(workspaceController.findUserWorkspaces));

workspaceRouter.get("/:slug", catchAsync(workspaceController.getBySlug));

workspaceRouter.get(
  "/:slug/settings/general",
  catchAsync(workspaceController.findGeneralSettings),
);

workspaceRouter.get(
  "/:slug/members",
  catchAsync(workspaceController.findAllMembers),
);

workspaceRouter.put(
  "/:workspaceId/details",
  catchAsync(workspaceController.updateDetails),
);

workspaceRouter.put(
  "/:workspaceId/visibility",
  catchAsync(workspaceController.updateVisibility),
);

workspaceRouter.put(
  "/:workspaceId/language",
  catchAsync(workspaceController.updateLanguage),
);

workspaceRouter.put(
  "/:workspaceId/notifications",
  catchAsync(workspaceController.updateNotifications),
);

workspaceRouter.post(
  "/:workspaceId/invite",
  catchAsync(workspaceController.inviteMember),
);

workspaceRouter.post(
  "/invite/accept",
  validateData(AcceptWorkspaceInviteDTO),
  catchAsync(workspaceController.acceptMember),
);

export default workspaceRouter;
