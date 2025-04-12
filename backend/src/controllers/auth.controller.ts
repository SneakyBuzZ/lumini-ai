import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../lib/schema.js";
import { ApiResponse } from "../lib/class.js";
import { db } from "../config/db.config.js";
import jwt, { VerifyErrors } from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  const {
    success,
    data: validatedData,
    error,
  } = registerSchema.safeParse(req.body);

  if (!success) {
    console.log(
      "ERROR :: AUTH CONTROLLER :: REGISTER :: VALIDATION FAILED: ",
      error.message
    );

    res
      .status(402)
      .json(
        new ApiResponse(
          402,
          {},
          "Invalid registration data recieved from the client"
        )
      );
  } else {
    const { name, email, image, oauthId, provider } = validatedData;

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      console.log(
        "ERROR :: AUTH CONTROLLER :: REGISTER :: USER ALREADY EXISTS"
      );

      res
        .status(409)
        .json(
          new ApiResponse(
            409,
            {},
            "User with the same email already exists in app"
          )
        );
    } else {
      try {
        const newUser = await db.user.create({
          data: {
            name,
            email,
            image,
            oauthId,
            provider,
          },
        });

        if (!newUser) {
          console.log(
            "ERROR :: AUTH CONTROLLER :: REGISTER :: FAILED TO CREATE USER"
          );

          res
            .status(500)
            .json(
              new ApiResponse(500, {}, "Failed to create user in the database")
            );
        } else {
          res
            .status(200)
            .json(
              new ApiResponse(200, newUser, "User registered successfully")
            );
        }
      } catch (error) {
        console.log(
          "ERROR :: AUTH CONTROLLER :: REGISTER :: SOMETHING WENT WRONG: ",
          error
        );

        res
          .status(501)
          .json(
            new ApiResponse(501, "An error occurred while registering the user")
          );
      }
    }
  }
};

export const login = async (req: Request, res: Response) => {
  console.log("LOGIN API HAS BEEN HIT");
  const {
    success,
    data: validatedData,
    error,
  } = loginSchema.safeParse(req.body);

  if (!success) {
    console.log(
      "ERROR :: AUTH CONTROLLER :: LOGIN :: VALIDATION FAILED: ",
      error
    );

    res
      .status(402)
      .json(
        new ApiResponse(
          402,
          {},
          "Invalid credentials recieved from the client for login"
        )
      );
  } else {
    console.log("Validated data: ", validatedData);

    const { email } = validatedData;

    try {
      const existingUser = await db.user.findUnique({
        where: {
          email: email,
        },
      });

      console.log("EXISTING USER : ", existingUser);

      if (!existingUser) {
        console.log(
          "ERROR :: AUTH CONTROLLER :: LOGIN :: USER DOES NOT EXISTS"
        );

        res
          .status(404)
          .json(
            new ApiResponse(
              404,
              {},
              "Authentication failed! User does not exists"
            )
          );
      } else {
        const payload = {
          sub: existingUser.id,
        };

        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });

        const updatedUser = await db.user.update({
          where: {
            id: existingUser.id,
          },
          data: {
            refreshToken,
          },
        });

        res.status(200).json(
          new ApiResponse(
            200,
            {
              user: updatedUser,
              accessToken: `Bearer ${accessToken}`,
              refreshToken: `Bearer ${refreshToken}`,
            },
            "User authenticated successfully"
          )
        );
      }
    } catch (error) {
      console.log("ERROR :: AUTH CONTROLLER :: LOGIN :: DB ERROR: ", error);

      res
        .status(500)
        .json(
          new ApiResponse(
            500,
            {},
            "An error occurred while authenticating the user"
          )
        );
    }
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "No refresh token is was not provided"));

  const user = await prisma.user.findFirst({
    where: {
      refreshToken,
    },
  });

  if (!user)
    return res.status(403).json(new ApiResponse(403, {}, "User not found"));

  jwt.verify(
    refreshToken,
    process.env.JWT_SECRET as string,
    (err: VerifyErrors) => {
      if (err)
        return res
          .status(403)
          .json(new ApiResponse(403, {}, "Invalid refresh token"));

      const payload = {
        sub: user.id,
      };
      const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(200).json(
        new ApiResponse(
          200,
          {
            accessToken: `Bearer ${accessToken}`,
          },
          "Access token refreshed successfully"
        )
      );
    }
  );
};
