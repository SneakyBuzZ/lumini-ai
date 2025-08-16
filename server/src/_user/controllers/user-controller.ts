import { db } from "@/lib/config/db-config";
import { DataResponse, ErrorResponse } from "@/utils/dto";
import { accountsTable } from "@/_user/models/account-model";
import { usersTable } from "@/_user/models/user-model";
import { Request, Response } from "express";
import { compareHash, generateHash } from "@/utils/bcrypt";
import { and, eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/utils/constants";
import {
  authenticateWithGithub,
  authenticateWithLogin,
} from "@/_user/user-helper";
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
}

const loginWithGoogle = async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) {
    res.status(400).json(new ErrorResponse(400, "Missing code"));
    return;
  }

  try {
    const data = await authenticateWithLogin(code as string, res);

    if (!data) {
      res.status(401).json(new ErrorResponse(401, "Invalid credentials"));
      return;
    }

    const { name, email, picture } = data;

    let [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "30d",
    });
    const hashedRefresh = await generateHash(refreshToken);

    if (!user) {
      const [newUser] = await db
        .insert(usersTable)
        .values({
          name,
          email,
          image: picture,
        })
        .returning();

      if (!newUser) {
        res.status(500).json(new ErrorResponse(500, "User not created"));
        return;
      }

      user = newUser;

      await db.insert(accountsTable).values({
        userId: newUser.id,
        provider: "google",
        providerAccountId: email,
        refreshToken: hashedRefresh,
        refreshTokenExpires: new Date(Date.now() + 30 * 60 * 60 * 24 * 1000),
      });
    } else {
      await db
        .update(accountsTable)
        .set({
          refreshToken: hashedRefresh,
          refreshTokenExpires: new Date(Date.now() + 30 * 60 * 60 * 24 * 1000),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(accountsTable.userId, user.id),
            eq(accountsTable.provider, "google")
          )
        );
    }

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000 * 24 * 1,
    });

    res
      .status(201)
      .json(new DataResponse(201, "Account created successfully."));
  } catch (error) {
    console.log("GOOGLE LOGIN ERROR: ", error);
    res.status(500).json(new ErrorResponse(500, "Something went wrong"));
    return;
  }
};

const loginWithGithub = async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) {
    res.status(400).json(new ErrorResponse(400, "Missing code"));
    return;
  }

  try {
    const data = await authenticateWithGithub(code as string, res);

    if (!data) {
      res.status(401).json(new ErrorResponse(401, "Invalid credentials"));
      return;
    }

    const { name, email, avatar_url } = data;

    let [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "30d",
    });
    const hashedRefresh = await generateHash(refreshToken);

    if (!user) {
      const [newUser] = await db
        .insert(usersTable)
        .values({
          name,
          email,
          image: avatar_url,
        })
        .returning();

      if (!newUser) {
        res.status(500).json(new ErrorResponse(500, "User not created"));
        return;
      }

      user = newUser;

      await db.insert(accountsTable).values({
        userId: newUser.id,
        provider: "github",
        providerAccountId: email,
        refreshToken: hashedRefresh,
        refreshTokenExpires: new Date(Date.now() + 30 * 60 * 60 * 24 * 1000),
      });
    } else {
      await db
        .update(accountsTable)
        .set({
          refreshToken: hashedRefresh,
          refreshTokenExpires: new Date(Date.now() + 30 * 60 * 60 * 24 * 1000),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(accountsTable.userId, user.id),
            eq(accountsTable.provider, "github")
          )
        );
    }

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000 * 24 * 1,
    });

    res
      .status(201)
      .json(new DataResponse(201, "Account created successfully."));
  } catch (error) {
    console.log("GOOGLE LOGIN ERROR: ", error);
    res.status(500).json(new ErrorResponse(500, "Something went wrong"));
    return;
  }
};

const getIsAuthenticated = async (req: Request, res: Response) => {
  res.status(200).json(new DataResponse(200, "Authenticated"));
  return;
};

export default {
  loginWithGoogle,
  loginWithGithub,
  getIsAuthenticated,
};
