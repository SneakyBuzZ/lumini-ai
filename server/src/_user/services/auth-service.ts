import { UserRepository } from "@/_user/repositories/user-repository";
import { AccountRepository } from "@/_user/repositories/account-repository";
import crypto from "crypto";
import { clearCookies, generateAndSetTokens } from "@/utils/jwt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/utils/constants";
import { LoginUserDTOType } from "@/_user/dto";
import { AppError } from "@/utils/error";
import { compareHash, generateHash } from "@/utils/bcrypt";
import { sendVerificationEmail } from "@/utils/mailer";
import { VerificationTokenRepository } from "../repositories/verification-token-repository";
import { SessionRepository } from "../repositories/session-repository";
import { db } from "@/lib/config/db-config";
import { WorkspaceInvitesRepository } from "@/_workspace/repositories/workspace-invites-repository";
import { WorkspaceMembersRepository } from "@/_workspace/repositories/workspace-members-repository";

export class AuthService {
  private userRepository: UserRepository;
  private accountRepository: AccountRepository;
  private sessionRepository: SessionRepository;
  private verificationTokenRepository: VerificationTokenRepository;
  private workspaceInvitesRepository: WorkspaceInvitesRepository;
  private workspaceMembersRepository: WorkspaceMembersRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.accountRepository = new AccountRepository();
    this.sessionRepository = new SessionRepository();
    this.verificationTokenRepository = new VerificationTokenRepository();
    this.workspaceInvitesRepository = new WorkspaceInvitesRepository();
    this.workspaceMembersRepository = new WorkspaceMembersRepository();
  }

  async register(req: Request, res: Response) {
    const data = req.body;
    const { inviteToken } = data;
    const userAgent = req.headers["user-agent"] || "";
    const ipAddress = req.ip;

    const result = await db.transaction(async (tx) => {
      //* ----- CHECK EXISTING USER -----
      const existingUser = await this.userRepository.findByEmail(
        data.email,
        tx,
      );
      if (existingUser) {
        throw new AppError(409, "Email is already registered.");
      }

      //* ----- VALIDATE INVITE (IF PROVIDED) -----
      let invite = null;

      if (inviteToken) {
        invite = await this.workspaceInvitesRepository.findByToken(
          inviteToken,
          tx,
        );
        if (!invite) throw new AppError(400, "Invalid invite token.");
        if (invite.status !== "pending")
          throw new AppError(400, "Invite token already used.");
        if (invite.expiresAt < new Date())
          throw new AppError(400, "Invite token expired.");
        if (invite.email !== data.email)
          throw new AppError(400, "Email does not match invite.");
      }

      //* ----- CREATE USER -----
      const hashedPassword = await generateHash(data.password);
      const userId = await this.userRepository.save(
        {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          emailVerified: invite ? new Date() : null,
        },
        tx,
      );
      await this.accountRepository.save(userId, "email", data.email, tx);

      let workspaceId: string | null = null;

      //* ----- IF INVITE EXISTS → ACCEPT MEMBERSHIP -----
      if (invite) {
        await this.workspaceMembersRepository.insert(
          {
            memberId: userId,
            role: invite.role,
            workspaceId: invite.workspaceId,
          },
          tx,
        );
        await this.workspaceInvitesRepository.markAccepted(invite.id, tx);
        workspaceId = invite.workspaceId;
      } else {
        //* ----- CREATE EMAIL VERIFICATION TOKEN -----
        const verifyToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = await generateHash(verifyToken);
        const verifyLookupKey = crypto
          .createHash("sha256")
          .update(verifyToken)
          .digest("hex");

        await this.verificationTokenRepository.save(
          {
            userId,
            tokenHash: hashedToken,
            type: "email_verification",
            lookupKey: verifyLookupKey,
          },
          tx,
        );

        await sendVerificationEmail({
          to: data.email,
          token: verifyToken,
        });
      }

      return {
        userId,
        workspaceId,
      };
    });

    //* ----- GENERATE TOKENS & SAVE SESSION -----
    const { refreshToken, hashedRefresh } = await generateAndSetTokens(
      res,
      result.userId,
    );
    const refreshLookupKey = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    await this.sessionRepository.save({
      userId: result.userId,
      userAgent,
      ipAddress,
      refreshTokenHash: hashedRefresh,
      lookupKey: refreshLookupKey,
    });

    return result.workspaceId;
  }

  async login(req: Request, res: Response) {
    //* ----- EXTRACT DATA ------
    const userAgent = req.headers["user-agent"] || "";
    const ipAddress = req.ip;
    const body = req.body as LoginUserDTOType;

    //* ----- VALIDATE USER ------
    const user = await this.userRepository.findByEmail(body.email);
    if (!user || !user.password)
      throw new AppError(400, "Invalid credentials.");

    //* ----- VALIDATE PASSWORD & VERIFICATION ------
    const isPasswordValid = await compareHash(body.password, user.password);
    if (!isPasswordValid) {
      throw new AppError(400, "Incorrect password was entered.");
    }
    if (!user.emailVerified) {
      throw new AppError(403, "Please verify your email.");
    }

    //* ----- UPDATE SESSION ----
    const { hashedRefresh: hashedRefreshToken, refreshToken } =
      await generateAndSetTokens(res, user.id);
    const refreshLookupKey = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    await this.sessionRepository.save({
      userId: user.id,
      userAgent,
      ipAddress,
      refreshTokenHash: hashedRefreshToken,
      lookupKey: refreshLookupKey,
    });
  }

  async verifyEmail(req: Request, res: Response) {
    //* ----- VALIDATE ------
    const { token } = req.body;
    if (!token) throw new AppError(400, "Verification token is required.");

    //* ----- FIND TOKEN ------
    const lookupKey = crypto.createHash("sha256").update(token).digest("hex");
    const record =
      await this.verificationTokenRepository.findByLookupKeyAndType(
        lookupKey,
        "email_verification",
      );

    //* ----- VALIDATE TOKEN ------
    if (!record) {
      throw new AppError(
        400,
        "Token not found or expired. Please request a new one.",
      );
    }
    if (new Date() > record.expiresAt) {
      await this.verificationTokenRepository.deleteByUserAndType(
        record.userId,
        "email_verification",
      );
      throw new AppError(
        400,
        "Verification token has expired. Please request a new one.",
      );
    }

    //* ----- MARK EMAIL AS VERIFIED ------
    const isMatch = await compareHash(token, record.tokenHash);
    if (!isMatch) throw new AppError(400, "Invalid verification token.");
    await this.userRepository.update(record.userId, {
      emailVerified: new Date(),
    });

    //* ----- DELETE ALL EMAIL VERIFICATION TOKENS FOR USER ------
    await this.verificationTokenRepository.deleteByUserAndType(
      record.userId,
      "email_verification",
    );
  }

  async resendVerificationEmail(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) throw new AppError(401, "Unauthorized");

    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError(404, "User not found");

    //* ----- DELETE EXISTING TOKENS ------
    await this.verificationTokenRepository.deleteByUserAndType(
      userId,
      "email_verification",
    );

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await generateHash(rawToken);
    const lookupKey = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    await this.verificationTokenRepository.save({
      userId,
      tokenHash: hashedToken,
      type: "email_verification",
      lookupKey,
    });
    await sendVerificationEmail({ to: user.email, token: rawToken });
  }

  async refresh(req: Request, res: Response) {
    const id = req.user?.id;
    if (!id) return;

    //* ----- CHECK FOR REFRESH TOKEN ------
    const refreshToken = req.signedCookies?.refreshToken;
    if (!refreshToken)
      throw new AppError(401, "Session expired, please log in again.");

    //* ----- VERIFY REFRESH TOKEN ------
    let decoded: { userId: string };
    try {
      decoded = jwt.verify(refreshToken, JWT_SECRET) as { userId: string };
    } catch {
      throw new AppError(401, "Invalid refresh token");
    }

    //* ----- FIND SESSION ------
    const refreshLookupKey = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    const session =
      await this.sessionRepository.findByLookupKey(refreshLookupKey);
    if (!session) throw new AppError(401, "Session not found");

    //* ----- VALIDATE REFRESH TOKEN ------
    const isMatched = await compareHash(refreshToken, session.refreshTokenHash);
    if (!isMatched) throw new AppError(401, "Invalid refresh token");
    if (new Date() > session.expiresAt) {
      await this.sessionRepository.delete(session.id);
      throw new AppError(401, "Refresh token has expired");
    }

    //* ----- GENERATE NEW TOKENS ------
    await this.sessionRepository.delete(session.id);
    const {
      refreshToken: newRefreshToken,
      hashedRefresh: newRefreshTokenHash,
    } = await generateAndSetTokens(res, decoded.userId);
    const newRefreshLookupKey = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");
    await this.sessionRepository.save({
      userId: decoded.userId,
      userAgent: req.headers["user-agent"] || "",
      ipAddress: req.ip,
      refreshTokenHash: newRefreshTokenHash,
      lookupKey: newRefreshLookupKey,
    });
  }

  async logout(req: Request, res: Response) {
    const refreshToken = req.signedCookies?.refreshToken;

    //*----- CLEAR TOKENS & COOKIES ------
    if (!refreshToken) {
      clearCookies(res);
      return { success: true };
    }

    //* ----- VERIFY REFRESH TOKEN ------
    const refreshLookupKey = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    await this.sessionRepository.revokeByLookupKey(refreshLookupKey);

    clearCookies(res);

    return { success: true };
  }
}
