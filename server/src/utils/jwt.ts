import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/utils/constants";
import { generateHash } from "@/utils/bcrypt";
import { Response } from "express";

const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  signed: true,
  sameSite: "lax" as const,
  path: "/",
};

export async function generateAndSetTokens(res: Response, id: string) {
  const accessToken = jwt.sign({ userId: id }, JWT_SECRET, {
    expiresIn: "1d",
  });
  const refreshToken = jwt.sign({ userId: id }, JWT_SECRET, {
    expiresIn: "30d",
  });

  const hashedRefresh = await generateHash(refreshToken);

  res.cookie("accessToken", accessToken, {
    ...baseCookieOptions,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  res.cookie("refreshToken", refreshToken, {
    ...baseCookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return { hashedRefresh, refreshToken };
}

export function clearCookies(res: Response) {
  res.clearCookie("accessToken", baseCookieOptions);
  res.clearCookie("refreshToken", baseCookieOptions);
}
