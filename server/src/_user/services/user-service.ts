import { LoginUserDTOType, RegisterUserDTOType } from "@/_user/dto";
import { UserRepository } from "@/_user/repositories/user-repository";
import { compareHash, generateHash } from "@/utils/bcrypt";
import { AppError } from "@/utils/error";
import { AccountRepository } from "@/_user/repositories/account-repository";
import { generateAndSetTokens } from "@/utils/jwt";
import { Response } from "express";

export class UserService {
  private userRepository: UserRepository;
  private accountRepository: AccountRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.accountRepository = new AccountRepository();
  }

  async register(req: RegisterUserDTOType) {
    const userExists = await this.userRepository.findByEmail(req.email);
    if (userExists) {
      throw new AppError(409, "User already exists");
    }
    const hashedPassword = await generateHash(req.password);
    const { email, id } = await this.userRepository.saveUser({
      ...req,
      password: hashedPassword,
    });
    await this.accountRepository.saveAccount(email, id);
  }

  async login(req: LoginUserDTOType, res: Response) {
    const user = await this.userRepository.findByEmail(req.email);
    if (!user || !user.password) {
      throw new AppError(401, "Invalid email or password");
    }

    const isPasswordValid = await compareHash(req.password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, "Invalid email or password");
    }

    const hashedRefreshToken = await generateAndSetTokens(res, user.id);

    await this.accountRepository.updateAccount(user.id, hashedRefreshToken);
  }
}
