import { ErrorResponse } from "@/lib/responses/error.response";
import _ from "lodash";
import { z, ZodError } from "zod";

export const validateData = (schema: z.ZodObject<any, any>) => {
  return async (req: any, res: any, next: any) => {
    try {
      schema.parse(req.body);
      req.body = _.pick(req.body, Object.keys(schema.shape));
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res.status(400).json(new ErrorResponse(400, errorMessages));
      } else {
        res.status(500).json(new ErrorResponse(500, "Something went wrong"));
      }
    }
  };
};
