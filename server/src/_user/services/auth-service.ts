import { UserRepository } from "@/_user/repositories/user-repository";
import { AccountRepository } from "@/_user/repositories/account-repository";

import {
  clearCookies,
  generateAndSetTokens,
  refreshAndSetToken,
} from "@/utils/jwt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/utils/constants";
import { LoginUserDTOType } from "@/_user/dto";
import { AppError } from "@/utils/error";
import { compareHash } from "@/utils/bcrypt";
import { db } from "@/lib/config/db-config";

export class AuthService {
  private userRepository: UserRepository;
  private accountRepository: AccountRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.accountRepository = new AccountRepository();
  }

  async login(req: LoginUserDTOType, res: Response) {
    const user = await this.userRepository.findByEmail(req.email);

    if (!user || !user.password) {
      throw new AppError(400, "Invalid credentials, please try again.");
    }

    const isPasswordValid = await compareHash(req.password, user.password);
    if (!isPasswordValid) {
      throw new AppError(400, "Incorrect password was entered.");
    }

    const hashedRefreshToken = await generateAndSetTokens(res, user.id);

    await this.accountRepository.update(user.id, hashedRefreshToken);
  }

  async renewToken(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new AppError(401, "Refresh token is missing");
    }

    const decodedToken = jwt.verify(refreshToken, JWT_SECRET) as {
      userId: string;
    };
    const account = await this.accountRepository.findByUserId(
      decodedToken.userId
    );
    if (!account || !account.refreshToken || !account.refreshTokenExpires) {
      throw new AppError(401, "Invalid refresh token");
    }

    const isValid = await compareHash(refreshToken, account.refreshToken);
    if (!isValid || new Date() > account.refreshTokenExpires) {
      throw new AppError(401, "Refresh token is expired or invalid");
    }

    const user = await this.userRepository.findById(decodedToken.userId);
    if (!user) {
      throw new AppError(401, "User not found");
    }

    refreshAndSetToken(res, user.id);
  }

  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new AppError(401, "Refresh token is missing");
    }

    const decodedToken = jwt.verify(refreshToken, JWT_SECRET) as {
      userId: string;
    };

    const account = await this.accountRepository.findByUserId(
      decodedToken.userId
    );
    if (!account || !account.refreshToken || !account.refreshTokenExpires) {
      throw new AppError(401, "Invalid refresh token");
    }

    const isValid = await compareHash(refreshToken, account.refreshToken);
    if (!isValid || new Date() > account.refreshTokenExpires) {
      throw new AppError(401, "Refresh token is expired or invalid");
    }

    await this.accountRepository.resetToken(decodedToken.userId);

    clearCookies(res);
  }
}
