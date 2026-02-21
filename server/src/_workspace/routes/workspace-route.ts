import { validateData } from "@/middlewares/validate-middleware";
import { Router } from "express";
import {
  AcceptWorkspaceInviteDTO,
  SaveWorkspaceDTO,
  UpdateWorkspaceGeneralDTO,
  UpdateWorkspacePreferencesDTO,
} from "@/_workspace/dto";
import { WorkspaceController } from "@/_workspace/controllers/workspace-controller";
import { catchAsync } from "@/utils/catch-async";
import { WorkspaceSettingsController } from "../controllers/workspace-settings-controller";
import { WorkspaceMembersController } from "../controllers/workspace-members-controller";
import { WorkspaceInvitesController } from "../controllers/workspace-invites-controller";

const workspaceRouter = Router();

const workspaceController = new WorkspaceController();
const workspaceSettingsController = new WorkspaceSettingsController();
const workspaceMembersController = new WorkspaceMembersController();
const workspaceInvitesController = new WorkspaceInvitesController();

//^---------------- WORKSPACE ROUTES ----------------^//
workspaceRouter.post(
  "/",
  validateData(SaveWorkspaceDTO),
  catchAsync(workspaceController.create),
);
workspaceRouter.get("/:slug", catchAsync(workspaceController.getBySlug));
workspaceRouter.get("/", catchAsync(workspaceController.findUserWorkspaces));

//^---------------- WORKSPACE SETTINGS ROUTES ----------------^//
workspaceRouter.get(
  "/:slug/settings/general",
  catchAsync(workspaceSettingsController.getGeneral),
);
workspaceRouter.put(
  "/:slug/settings/general",
  validateData(UpdateWorkspaceGeneralDTO),
  catchAsync(workspaceSettingsController.updateGeneral),
);
workspaceRouter.put(
  "/:slug/settings/preferences",
  validateData(UpdateWorkspacePreferencesDTO),
  catchAsync(workspaceSettingsController.updatePreferences),
);

//^---------------- WORKSPACE MEMBERS ROUTES ----------------^//
workspaceRouter.get(
  "/:slug/members",
  catchAsync(workspaceMembersController.findAll),
);

//^---------------- WORKSPACE INVITES ROUTES ----------------^//
workspaceRouter.post(
  "/:slug/invite",
  catchAsync(workspaceInvitesController.invite),
);
workspaceRouter.post(
  "/invite/accept",
  validateData(AcceptWorkspaceInviteDTO),
  catchAsync(workspaceInvitesController.accept),
);

export default workspaceRouter;
