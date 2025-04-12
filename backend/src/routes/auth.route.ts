import { Router } from "express";
import {
  login,
  refreshAccessToken,
  register,
} from "../controllers/auth.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh-accessToken", authenticateJWT, refreshAccessToken);

export default authRouter;
