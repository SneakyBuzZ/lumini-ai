import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AppError } from "@/utils/error";
import { ErrorResponse } from "@/utils/dto";

export const errorMiddleware: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error("❌ Error:", err);

  if (err instanceof AppError) {
    res
      .status(err.statusCode)
      .json(new ErrorResponse(err.statusCode, err.message));
    return;
  }

  res.status(500).json(new ErrorResponse(500, "Internal Server Error"));
};
