import { RegisterUserDTOType } from "@/_user/dto";
import { UserRepository } from "@/_user/repositories/user-repository";
import { generateHash } from "@/utils/bcrypt";
import { AppError } from "@/utils/error";
import { AccountRepository } from "@/_user/repositories/account-repository";

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
    const { email, id } = await this.userRepository.save({
      ...req,
      password: hashedPassword,
    });
    await this.accountRepository.save(email, id);
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
}
