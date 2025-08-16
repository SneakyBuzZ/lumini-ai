import { Router } from "express";
import { LoginUserDTO } from "../dto";
import { validateData } from "@/middlewares/validate-middleware";
import { catchAsync } from "@/utils/catch-async";
import { AuthController } from "@/_user/controllers/auth-controller";

const authRouter = Router();

const authController = new AuthController();

authRouter.post(
  "/login",
  validateData(LoginUserDTO),
  catchAsync(authController.login)
);

export default authRouter;
