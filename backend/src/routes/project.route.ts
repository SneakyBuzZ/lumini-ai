import { Router } from "express";
import {
  create,
  getAll,
  getAnswerToQuestion,
} from "../controllers/project.controller.js";

const projectRouter = Router();

projectRouter.post("", create);

projectRouter.get("", getAll);

projectRouter.get("/ask", getAnswerToQuestion);

export default projectRouter;
