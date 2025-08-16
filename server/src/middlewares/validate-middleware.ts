import { ErrorResponse } from "@/utils/dto";
import { RequestHandler } from "express";
import _ from "lodash";
import { z, ZodError } from "zod";

export const validateData =
  <T extends z.ZodObject<any>>(schema: T): RequestHandler =>
  (req, res, next) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = _.pick(parsed, schema.keyof().options);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res.status(400).json(new ErrorResponse(400, errorMessages));
      } else {
        res.status(500).json(new ErrorResponse(500, "Something went wrong"));
      }
    }
  };
