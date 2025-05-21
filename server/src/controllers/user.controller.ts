import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import db from "../db";
import bcrypt from "bcryptjs";

const cookieOptions =
  process.env.NODE_ENV === "production"
    ? {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      }
    : {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: "none",
      };

export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new ApiError(400, "Please provide all fields...");
    }
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      throw new ApiError(400, "User already exists...");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError(400, "Please provide a valid email...");
    }

    const user = await db.user.create({
      data: {
        name,
        email,
        password: bcrypt.hashSync(password, 10),
      },
    });

    if (!user) {
      throw new ApiError(400, "Error in creating user...");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, user, "user created successfully..."));
  }
);

export const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found...");
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new ApiError(401, "Invalid password...");
    }

    // @ts-ignore
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRY!,
    });

    // const { _id, firstName, lastName, ...rest } = user.toJSON();

    res
      .cookie("token", token, cookieOptions as any)
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          "user loggedin successfully..."
        )
      );
  }
);

export const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.body.user;

    const user = await db.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        // todos: {
        //   select: {
        //     id: true,
        //     title: true,
        //     completed: true,
        //   },
        // },
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found...");
    }

    res
      .status(200)
      .json(new ApiResponse(200, user, "user get successfully..."));
  }
);

export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res
      .cookie("token", null, {
        path: "/",
        // expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        maxAge: 0,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .json(new ApiResponse(200, null, "user logout successfully..."));
  }
);
