import { DataResponse, ErrorResponse } from "@/utils/dto";
import { Request, Response } from "express";
import { UserService } from "@/_user/services/user-service";
import { AppError } from "@/utils/error";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  register = async (req: Request, res: Response) => {
    await this.userService.register(req.body);
    res.status(201).json(new DataResponse(201, "User created successfully"));
  };

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
}
