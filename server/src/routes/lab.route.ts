import { validateData } from "@/middlewares/validate.middleware";
import labController from "@/controllers/lab.controller";
import { Router } from "express";
import { createLabSchema } from "@/schemas/lab.schema";

const labRouter = Router();

labRouter.post("/", validateData(createLabSchema), labController.create);

export default labRouter;
