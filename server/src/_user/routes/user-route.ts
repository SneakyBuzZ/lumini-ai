import { Router } from "express";
import { validateData } from "@/middlewares/validate-middleware";
import { RegisterUserDTO } from "@/_user/dto";
import { catchAsync } from "@/utils/catch-async";
import { UserController } from "@/_user/controllers/user-controller";

const userRouter = Router();

const userController = new UserController();

userRouter.post(
  "/register",
  validateData(RegisterUserDTO),
  catchAsync(userController.register)
);

// userRouter.get("/login/google", catchAsync(userController.));
// userRouter.get("/login/github", catchAsync(userController.loginWithGithub));

// userRouter.get("/logout", authenticateJwt(), catchAsync(userController.logout));

// userRouter.get("", authenticateJwt(), catchAsync(userController.getUser));

// userRouter.get(
//   "/is-authenticated",
//   authenticateJwt(),
//   catchAsync(userController.getIsAuthenticated)
// );

export default userRouter;
