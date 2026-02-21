import { DataResponse, ErrorResponse } from "@/utils/dto";
import { Request, Response } from "express";
import { UserService } from "@/_user/services/user-service";
import { AppError } from "@/utils/error";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getUser = async (req: Request, res: Response) => {
    const id = req.user?.id;
    if (!id) {
      throw new AppError(401, "Unauthorized");
    }
    const user = await this.userService.findById(id);
    res
      .status(200)
      .json(new DataResponse(200, user, "User retrieved successfully"));
  };

  getUsersByIds = async (req: Request, res: Response) => {
    const idsParam = req.query.ids;
    if (!idsParam || typeof idsParam !== "string") {
      return res
        .status(400)
        .json(new ErrorResponse(400, "ids query param required"));
    }
    const ids = idsParam.split(",");

    const users = await this.userService.findByIds(ids);
    res
      .status(200)
      .json(new DataResponse(200, users, "Users retrieved successfully"));
  };

  updateEmail = async (req: Request, res: Response) => {
    const { email, newEmail } = req.body;
    await this.userService.updateEmail(email, newEmail);
    return res
      .status(200)
      .json(new DataResponse(200, "Email updated successfully"));
  };
}
