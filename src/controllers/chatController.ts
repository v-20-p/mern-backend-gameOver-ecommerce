import { NextFunction, Request, Response } from 'express'

import { CustomRequest } from '../middlewares/auth'
import ApiError from '../errors/ApiError'
import { Users } from '../models/userSchema'
import { handleUserMessage } from '../openaiIntegration'
import { Chat } from '../models/chatSchema'

export const sendMessage = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { message } = req.body
    if (!req.userId) {
      throw ApiError.badRequest(401, 'User ID is missing')
    }
    const user = await Users.findById(req.userId)

    if (!user) {
      throw ApiError.badRequest(404, 'User not found')
    }

    let userChat = await Chat.findOne({ user: user._id })

    if (!userChat) {
      userChat = new Chat({ message: [], user: user._id })
    }

    userChat.message.push({ sender: 'user', content: message })

    const openaiResponse = await handleUserMessage(message)

    userChat.message.push({ sender: 'bot', content: openaiResponse })

    await userChat.save()

    res.json({ botMessage: { sender: 'bot', content: openaiResponse } })
  } catch (error) {
    next(error)
  }
}
export const getAllmessageOfUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw ApiError.badRequest(401, 'User ID is missing')
    }

    const userChat = await Chat.findOne({ user: req.userId })

    if (!userChat) {
      res.json({ messages: [] })
      return
    }
    res.json({ messages: userChat.message })
  } catch (error) {
    next(error)
  }
}
