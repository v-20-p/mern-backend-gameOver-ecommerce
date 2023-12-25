import { NextFunction, Request, Response } from 'express'
import Jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken'


import ApiError from '../errors/ApiError'
import { Users } from '../models/userSchema'
import { dev } from '../config'


export interface CustomRequest extends Request {
  userId?: string
}

export const isLoggedIn = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.access_token

    if (!accessToken) {
      throw ApiError.badRequest(401, 'You are not logged in')
    }

    const decoded = Jwt.verify(accessToken, dev.app.secret_key) as JwtPayload
    if (!decoded) {
      throw ApiError.badRequest(401, 'Invalied access token')
    }
   
    req.userId = decoded._id

    next()
  } catch (error) {
    next(error)
  }
}

// export const isLoggedOut = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const accessToken = req.cookies.access_token
//     if (accessToken) {
//       throw ApiError.badRequest(401, 'You are already logged in')
//     }
//     next()
//   } catch (error) {
//     next(error)
//   }
// }
export const isLoggedOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.access_token;

    if (token) {
      try {
        const decoded = Jwt.verify(token, dev.app.secret_key) as JwtPayload;
        if (decoded) {
          // Token is decoded, meaning the user is already logged in
          throw ApiError.badRequest(400, 'You are already logged in');
        }
      } catch (error) {
        // If the error is a TokenExpiredError, it means the token is expired
        if (error instanceof TokenExpiredError) {
          // Move to the next middleware or controller
          return next();
        }
        // If it's any other error, handle it as needed
        throw error;
      }
    }

    // If token is not present, move to the next middleware or controller
    return next();
  } catch (error) {
    next(error);
  }
};

export const isAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      throw ApiError.badRequest(401, 'User ID is missing')
    }

    const user = await Users.findById(req.userId)

    if (user && user.isAdmin) {
      console.log("admin")
      next()
    } else {
      throw ApiError.badRequest(403, `You are not an admin `)
    }
  } catch (error) {
    next(error)
  }
}
