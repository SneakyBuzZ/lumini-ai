import jwt from "jsonwebtoken";
import cookie from "cookie";
import signature from "cookie-signature";
import { JWT_SECRET, COOKIE_SECRET } from "@/utils/constants";

export type WSUser = {
  id: string;
};

export function authenticateWS(req: any): WSUser {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    throw new Error("No cookies");
  }

  const cookies = cookie.parse(cookieHeader);

  const signed = cookies["accessToken"];
  if (!signed) {
    throw new Error("No access token");
  }

  if (!signed.startsWith("s:")) {
    throw new Error("Invalid signed cookie");
  }

  const unsigned = signature.unsign(signed.slice(2), COOKIE_SECRET);

  if (!unsigned) {
    throw new Error("Invalid cookie signature");
  }

  const decoded = jwt.verify(unsigned, JWT_SECRET) as {
    userId: string;
  };

  return {
    id: decoded.userId,
  };
}
