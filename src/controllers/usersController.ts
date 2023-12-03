import { Request, Response, NextFunction } from 'express'
import { Users } from '../models/userSchema'
import Jwt, { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { sendEmail } from '../services/emailServices'
import { dev } from '../config'
import ApiError from '../errors/ApiError'
import { deleteImage } from '../services/deleteImageService'

const generateToken = (encodedData: any) => {
  return Jwt.sign(encodedData, dev.app.secret_key, {
    expiresIn: '3h',
  })
}

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await Users.find()
    res.status(200).send({
      message: 'Successfully retrieved all users.',
      users,
    })
  } catch (error) {
    next(error)
  }
}

export const getOneUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const user = await Users.findById(id)

    if (!user) {
      return res.status(404).send({
        message: 'User not found.',
      })
    }

    res.status(200).send({
      message: 'Successfully retrieved the user.',
      user,
    })
  } catch (error) {
    next(error)
  }
}

export const newUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { name, userName, isAdmin, isBan, email, password } = req.body
    const image = req.file?.path
    let newUserBody = {
      name,
      userName,
      isAdmin,
      isBan,
      image,
      email,
      password: await bcrypt.hash(password, 7),
    }
    if (image) {
      newUserBody = { ...newUserBody, image }
    }
    const token = Jwt.sign(newUserBody, dev.app.secret_key, { expiresIn: '10m' })
    sendEmail(
      newUserBody.email,
      'activate your acount',
      `<h1>hi , ${name}</h1>
        <p>you can activate your acount <a href='http://localhost:5050/users/activate/${token}' >hare</a></p>
        <br>
        <p>if is not you please ignore this message</p>
        `
    )
    res.status(201).send({
      message: 'User created successfully.',
      token,
    })
  } catch (error) {
    next(error)
  }
}

export const activateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params

    const decodedToken = await Jwt.verify(token, dev.app.secret_key)
    if (!decodedToken) {
      throw ApiError.badRequest(403, 'Token was invalid')
    }

    const user = new Users(decodedToken)
    await user.save()

    res.status(200).send({ message: 'User activated successfully.', user: decodedToken })
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res
        .status(400)
        .send({ message: 'Activation token has expired. Please request a new one.' })
    }

    console.error('Error activating user:', error)
    next(error)
  }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const { name, userName, isAdmin, isBan } = req.body

    const updatedUser = await Users.findByIdAndUpdate(
      id,
      { name, userName, isAdmin, isBan },
      { new: true }
    )

    if (!updatedUser) {
      return res.status(404).send({
        message: 'User not found.',
      })
    }

    res.status(200).send({
      message: 'User updated successfully.',
      user: updatedUser,
    })
  } catch (error) {
    next(error)
  }
}

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    const user = await Users.findOne({ email })

    if (!user || user.isBan) {
      return res.status(404).send({
        message: 'User not found.',
      })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
      res.clearCookie("access_token")
      throw ApiError.badRequest(403, 'password is invalid')
    }
    res.cookie('access_token', generateToken({ _id: user._id }), {
      maxAge: 15 * 60 * 1000, //15 minutes
      httpOnly: true,
      sameSite: 'none',
    })

    res.status(200).send({
      message: 'User login successfully.',
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}
export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('access_token')
    res.status(200).send({
      message: 'User logout successfully.',
    })
  } catch (error) {
    next(error)
  }
}
export const updateBan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id // Assuming you get id from the route parameters
    const user = await Users.findById(id)

    if (!user) {
      throw ApiError.badRequest(404, 'User was not found')
    }

    user.isBan = !user.isBan
    await user.save()

    res.status(200).send({
      message: 'User status is updated',
    })
  } catch (error) {
    next(error)
  }
}

export const deleteSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const user = await Users.findByIdAndDelete(id)

    if (!user) {
      throw ApiError.badRequest(404, `User not found with this ID: ${id}`)
    }

    if (user && user.image) {
      await deleteImage(user.image)
    }

    res.status(200).json({
      message: `Deleted user with ID: ${id}`,
    })
  } catch (error) {
    next(error)
  }
}


export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body
    const user = await Users.findOne({ email })
    if (!user) {
      return res.status(404).send({
        message: 'User not found.',
      })
    }

    const resetToken = Jwt.sign({ userId: user._id }, dev.app.secret_key, {
      expiresIn: '1h',
    })

    const resetLink = `http://localhost:5050/users/reset-password/${resetToken}`
    await sendEmail(
      user.email,
      'Reset Your Password',
      `<h1>Hi, ${user.name}</h1>
        <p>You can reset your password by clicking the following link:</p>
        <a href='${resetLink}'>Reset Password</a>
        <br>
        <p>If you did not request a password reset, please ignore this email.</p>`
    )

    res.status(200).send({
      message: 'Password reset email sent successfully. Check your inbox for instructions.',
      resetToken
    })
  } catch (error) {
    next(error)
  }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body

    // Verify the reset token
    const decodedToken = Jwt.verify(token, dev.app.secret_key) as JwtPayload

    if (!decodedToken) {
      return res.status(403).send({
        message: 'Invalid reset token.',
      })
    }

    const user = await Users.findOne({ _id: decodedToken.userId })

    if (!user) {
      return res.status(404).send({
        message: 'User not found.',
      })
    }
    user.password = await bcrypt.hash(newPassword, 7)
    await user.save()

    res.status(200).send({
      message: 'Password reset successfully.',
    })
  } catch (error) {
    next(error)
  }
}
