import { Router } from "express";
import userController from "@/controllers/user.controller";
import { validateData } from "@/middlewares/validate.middleware";
import { emailAuthSchema } from "@/tables/user.table";
import { authenticateJwt } from "@/middlewares/authenticate.middleware";

const userRouter = Router();

userRouter.post(
  "/register",
  validateData(emailAuthSchema),
  userController.register
);

userRouter.post("/login", validateData(emailAuthSchema), userController.login);

userRouter.get("/login/google", userController.loginWithGoogle);
userRouter.get("/login/github", userController.loginWithGithub);

userRouter.get("/logout", authenticateJwt(), userController.logout);

userRouter.get("", authenticateJwt(), userController.getUser);

userRouter.get(
  "/is-authenticated",
  authenticateJwt(),
  userController.getIsAuthenticated
);

export default userRouter;
