import { ErrorResponse } from "@/lib/responses/error.response";
import { JWT_SECRET } from "@/utils/constants";
import jwt from "jsonwebtoken";

export const authenticateJwt = () => {
  return async (req: any, res: any, next: any) => {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res
        .status(401)
        .json(new ErrorResponse(401, "Access token missing"));
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
