import express from 'express'

import { isLoggedIn } from '../middlewares/auth'

import { getAllmessageOfUser, sendMessage } from '../controllers/chatController'

export const chatRoute = express.Router()

chatRoute.post('/', isLoggedIn, sendMessage)
chatRoute.get('/', isLoggedIn, getAllmessageOfUser)
