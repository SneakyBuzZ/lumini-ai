import { DataResponse } from "@/utils/dto";
import { Request, Response } from "express";
import { AuthService } from "@/_user/services/auth-service";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response) => {
    await this.authService.login(req.body, res);
    res.status(200).json(new DataResponse(200, "Login successful"));
  };

  renewToken = async (req: Request, res: Response) => {
    await this.authService.renewToken(req, res);
    res.status(200).json(new DataResponse(200, "Token renewed successfully"));
  };

  logout = async (req: Request, res: Response) => {
    await this.authService.logout(req, res);
    res.status(200).json(new DataResponse(200, "Logout successful"));
  };

  getStatus = async (req: Request, res: Response) => {
    res.status(200).json(new DataResponse(200, "User is authenticated"));
  };
}
