import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/utils/constants";
import { generateHash } from "@/utils/bcrypt";
import { db } from "@/lib/config/db-config";
import { Response } from "express";

export async function generateAndSetTokens(res: Response, id: string) {
  const accessToken = jwt.sign({ userId: id }, JWT_SECRET, {
    expiresIn: "7d", // 7 days
  });
  const refreshToken = jwt.sign({ userId: id }, JWT_SECRET, {
    expiresIn: "30d", // 1 month
  });

  const hashedRefresh = await generateHash(refreshToken);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return hashedRefresh;
}

export function refreshAndSetToken(res: Response, userId: string) {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d", // 7 days
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export function clearCookies(res: Response) {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
}
