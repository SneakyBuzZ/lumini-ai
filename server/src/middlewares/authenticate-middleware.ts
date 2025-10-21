import { ErrorResponse } from "@/utils/dto";
import { JWT_SECRET } from "@/utils/constants";
import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";

export const authenticateJwt = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.signedCookies?.accessToken;

    if (!token) {
      return res.status(401).json(new ErrorResponse(401, "Unauthorized"));
    }

    try {
      const decodedToken = jwt.verify(token, JWT_SECRET) as { userId: string };
      req.user = {
        id: decodedToken.userId,
      };
      next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json(new ErrorResponse(401, "Access token expired"));
      }

      return res.status(401).json(new ErrorResponse(401, "Unauthorized"));
    }
  };
};
