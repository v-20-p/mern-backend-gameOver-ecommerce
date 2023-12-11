import express, { Application } from 'express'
import mongoose from 'mongoose'
import { config } from 'dotenv'
import cors from "cors"

import 'dotenv/config'
import usersRouter from './routers/usersRouter'
import productsRouter from './routers/productsRouter'
import ordersRouter from './routers/ordersRouter'
import categoreisRouter from './routers/categoriesRouter'
import apiErrorHandler from './middlewares/errorHandler'
import myLogger from './middlewares/logger'
import cookieParser from 'cookie-parser'
import { chatRoute } from './routers/chatRouter'
import ApiError from './errors/ApiError'

config()
const app: Application = express()
const PORT = 5050
const URL = process.env.MONGODB_URL as string

app.use(myLogger)
app.use(express.urlencoded({ extended: true })), app.use(express.json()), app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('healthe checkup')
})

app.use('/api/users', usersRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/products', productsRouter)
app.use('/api/categories', categoreisRouter)
app.use('/api/chat', chatRoute)

app.use(cors())

app.use((req, res, next) => {
  if (!req.route)
  return next(ApiError.badRequest(404, 'Rout not found'))
})
app.use(apiErrorHandler)

mongoose
  .connect(URL)
  .then(() => {
    console.log('Database connected')
  })
  .catch((err: Error) => {
    console.log('MongoDB connection error, ', err)
  })

app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`)
})
