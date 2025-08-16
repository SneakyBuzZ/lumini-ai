import { Router } from "express";
import { LoginUserDTO } from "../dto";
import { validateData } from "@/middlewares/validate-middleware";
import { catchAsync } from "@/utils/catch-async";
import { AuthController } from "@/_user/controllers/auth-controller";
import { authenticateJwt } from "@/middlewares/authenticate-middleware";

const authRouter = Router();

const authController = new AuthController();

authRouter.post(
  "/login",
  validateData(LoginUserDTO),
  catchAsync(authController.login)
);

authRouter.post(
  "/renew-token",
  authenticateJwt(),
  catchAsync(authController.renewToken)
);

authRouter.post(
  "/logout",
  authenticateJwt(),
  catchAsync(authController.logout)
);

authRouter.get(
  "/status",
  authenticateJwt(),
  catchAsync(authController.getStatus)
);

export default authRouter;
