import { DataResponse } from "@/utils/dto";
import { Request, Response } from "express";
import { AuthService } from "@/_user/services/auth-service";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response) => {
    await this.authService.register(req, res);
    res.status(201).json(new DataResponse(201, "Registration successful"));
  };

  login = async (req: Request, res: Response) => {
    await this.authService.login(req, res);
    res.status(200).json(new DataResponse(200, "Login successful"));
  };

  verifyEmail = async (req: Request, res: Response) => {
    await this.authService.verifyEmail(req, res);
    res.status(200).json(new DataResponse(200, "Email verified successfully"));
  };

  resendVerificationEmail = async (req: Request, res: Response) => {
    await this.authService.resendVerificationEmail(req, res);
    res
      .status(200)
      .json(new DataResponse(200, "Verification email resent successfully"));
  };

  logout = async (req: Request, res: Response) => {
    await this.authService.logout(req, res);
    res.status(200).json(new DataResponse(200, "Logout successful"));
  };

  getStatus = async (req: Request, res: Response) => {
    res.status(200).json(new DataResponse(200, "User is authenticated"));
  };

  refresh = async (req: Request, res: Response) => {
    await this.authService.refresh(req, res);
    res.status(200).json(new DataResponse(200, "Token refreshed successfully"));
  };
}
