import { NextFunction, Request, Response ,  } from 'express'
import ApiError from '../errors/ApiError';

export const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const accessToken= req.cookies.accessToken;
        if(!accessToken){
             throw ApiError.badRequest(409,'Token was invalid')
        }
    next()
     
    } catch (error) {
        next(error);
    }
};



