import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'

import { createError } from '../utility/createError'
import { dev } from '../config'
import { User } from '../models/user'

export const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      throw createError(404, 'No user found with this email')
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      throw createError(401, 'Password does not match')
    }

    if (user.isBan) {
      throw createError(403, 'User is banned')
    }

    const accessToken = JWT.sign({ _id: user._id }, dev.app.jwtAccessKey, { expiresIn: '20m' })

    res.cookie('access_token', accessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      sameSite: 'none',
    }) //httpOnly -> to make the cookie not accessable by the browser, for security reasons, it will be available for the next http request only //sameSite -> to use this cookie from different sited e.g. different ports

    res.send({ message: 'User is logged in' })
  } catch (error) {
    next(error)
  }
}

export const handleLogout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('access_token')
    res.send({ message: 'User is logged out' })
  } catch (error) {
    next(error)
  }
}
