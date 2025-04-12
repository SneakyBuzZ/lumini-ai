import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { JwtPayloadType } from "../lib/type.js";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.sendStatus(403);
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (err, payload: JwtPayloadType) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.userId = payload.sub;
      console.log(`ROUTE: ${req.method} ${req.originalUrl}`);
      next();
    }
  );
};
