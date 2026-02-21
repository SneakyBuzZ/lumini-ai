import { UserRepository } from "@/_user/repositories/user-repository";
import { AppError } from "@/utils/error";
import { AccountRepository } from "@/_user/repositories/account-repository";
import { generateHash } from "@/utils/bcrypt";
import crypto from "crypto";
import { VerificationTokenRepository } from "../repositories/verification-token-repository";
import { sendVerificationEmail } from "@/utils/mailer";

export class UserService {
  private userRepository: UserRepository;
  private accountRepository: AccountRepository;
  private verificationTokenRepository: VerificationTokenRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.accountRepository = new AccountRepository();
    this.verificationTokenRepository = new VerificationTokenRepository();
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError(404, "User not found");
    }
    return user;
  }

  async findByIds(ids: string[]) {
    const users = await this.userRepository.findByIds(ids);
    return users || [];
  }

  async updateEmail(email: string, newEmail: string) {
    //*----- CHECK IF NEW EMAIL IS ALREADY IN USE ------
    const existingUser = await this.userRepository.findByEmail(newEmail);
    if (existingUser) {
      throw new AppError(409, "Email already in use");
    }

    //*----- FIND USER BY CURRENT EMAIL ------
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    //*----- UPDATE EMAIL IN USER & ACCOUNT ------
    await this.userRepository.update(user.id, { email: newEmail });
    await this.accountRepository.update(user.id, {
      providerAccountId: newEmail,
    });

    //*----- CREATE VERIFICATION TOKEN & SEND VERIFICATION EMAIL ------
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const hashedVerifyToken = await generateHash(verifyToken);
    const verifyLookupKey = crypto
      .createHash("sha256")
      .update(verifyToken)
      .digest("hex");
    await this.verificationTokenRepository.save({
      userId: user.id,
      tokenHash: hashedVerifyToken,
      type: "email_verification",
      lookupKey: verifyLookupKey,
    });
    await sendVerificationEmail({ to: newEmail, token: verifyToken });
  }
}
