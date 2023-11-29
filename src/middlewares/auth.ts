import { NextFunction, Request, Response ,  } from 'express'
import ApiError from '../errors/ApiError';
import { User } from '../models/user';
import { dev } from '../config';
import  Jwt, { JwtPayload }  from 'jsonwebtoken';

interface CustomRequest extends Request {
    userId?: string
  }

export const isLoggedIn = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const accessToken= req.cookies.access_token;
  
      if (!accessToken) {
        throw ApiError.badRequest(401, 'You are not logged in')
      }
  
      const decoded = (await Jwt.verify(accessToken, dev.app.secret_key)) as JwtPayload
      if (!decoded) {
        throw ApiError.badRequest(401, 'Invalied access token')
      }
  
      req.userId = decoded._id
  
      next()
    } catch (error) {
      next(error)
    }
  }

export const isLoggedOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken= req.cookies.accessToken;
      if (accessToken) {
        throw ApiError.badRequest(401, 'You are already logged in')
      }
      next()
    } catch (error) {
      next(error)
    }
  }
  
  export const isAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.userId)
      if (user?.isAdmin) {
        next()
      } else {
        throw ApiError.badRequest(403, 'You are not admin')
      }
    } catch (error) {
      next(error)
    }
  }
