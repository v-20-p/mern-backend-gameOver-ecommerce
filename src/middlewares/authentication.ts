import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { createError } from "../utility/createError";
import { dev } from "../config";
import { User } from "../models/user";

interface CustomeRequest extends Request {
  userId?: string;
}

export const isLoggedIn = async (
  req: CustomeRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
      throw createError(401, "You are not logged in");
    }

    const decoded = (await jwt.verify(
      accessToken,
      dev.app.jwtAccessKey
    )) as JwtPayload;
    if (!decoded) {
      throw createError(401, "Invalid access token");
    }

    req.userId = decoded._id;

    next();
  } catch (error) {
    next(error);
  }
};

export const isLoggedOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.access_token;
    if (accessToken) {
      throw createError(401, "You are already logged in");
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const isAdmin = async (
  req: CustomeRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.userId)
    if(user?.isAdmin){
        next()
    } else {
        throw createError(403, 'Only admins are authorized')
    }
  } catch (error) {
    next(error);
  }
};
