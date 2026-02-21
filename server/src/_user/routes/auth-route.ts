import { Router } from "express";
import { LoginUserDTO, RegisterUserDTO, VerifyEmailDTO } from "../dto";
import { validateData } from "@/middlewares/validate-middleware";
import { catchAsync } from "@/utils/catch-async";
import { AuthController } from "@/_user/controllers/auth-controller";
import { authenticateJwt } from "@/middlewares/authenticate-middleware";

const authRouter = Router();

const authController = new AuthController();

authRouter.post(
  "/register",
  validateData(RegisterUserDTO),
  catchAsync(authController.register),
);

authRouter.post(
  "/login",
  validateData(LoginUserDTO),
  catchAsync(authController.login),
);

authRouter.post(
  "/verify/email",
  authenticateJwt(),
  validateData(VerifyEmailDTO),
  catchAsync(authController.verifyEmail),
);

authRouter.post(
  "/verify/email/resend",
  authenticateJwt(),
  catchAsync(authController.resendVerificationEmail),
);

authRouter.post(
  "/logout",
  authenticateJwt(),
  catchAsync(authController.logout),
);

authRouter.get(
  "/status",
  authenticateJwt(),
  catchAsync(authController.getStatus),
);

authRouter.post("/refresh", catchAsync(authController.refresh));

export default authRouter;
