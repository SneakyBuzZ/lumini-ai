import { DataResponse } from "@/utils/dto";
import { UserService } from "../services/user-service";
import { Request, Response } from "express";

export class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async login(req: Request, res: Response) {
    await this.userService.login(req.body, res);
    res.status(200).json(new DataResponse(200, "Login successful"));
  }
}
