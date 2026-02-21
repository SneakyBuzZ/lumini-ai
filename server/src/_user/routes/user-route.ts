import { Router } from "express";
import { catchAsync } from "@/utils/catch-async";
import { UserController } from "@/_user/controllers/user-controller";
import { authenticateJwt } from "@/middlewares/authenticate-middleware";

const userRouter = Router();

const userController = new UserController();

userRouter.get("/", authenticateJwt(), catchAsync(userController.getUser));

userRouter.get("/all", catchAsync(userController.getUsersByIds));

export default userRouter;
