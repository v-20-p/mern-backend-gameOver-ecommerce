import { NextFunction, Request, Response } from 'express'
import ApiError from '../errors/ApiError'

const apiErrorHandler = (err: typeof ApiError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    res.status(err.code).json({ message: err.message })
    return
  }
  else{
    res.status(500).json({ message: 'Something went wrong.' })
  }
}

export default apiErrorHandler
