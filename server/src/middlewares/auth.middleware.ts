import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";

export const isLoggedIn = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const cookie = req?.headers?.cookie;
    // const cookie = req?.headers?.cookie.split(' ')[1];

    if (!cookie) {
      throw new ApiError(404, "cookie not found...");
    }

    const [, token] = cookie?.split("=");

    if (!token) {
      throw new ApiError(404, "token not found...");
    }

    const decode = await jwt.verify(token, process.env.JWT_SECRET!);

    req.body.user = decode;

    next();
  }
);
