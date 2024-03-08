import express, { Application } from 'express'
import mongoose from 'mongoose'
import { config } from 'dotenv'
import cors from "cors"
import cookieParser from 'cookie-parser'

import 'dotenv/config'
import usersRouter from '../src/routers/usersRouter'
import productsRouter from '../src/routers/productsRouter'
import ordersRouter from '../src/routers/ordersRouter'
import categoreisRouter from '../src/routers/categoriesRouter'
import apiErrorHandler from '../src/middlewares/errorHandler'
import { chatRoute } from '../src/routers/chatRouter'
import ApiError from '../src/errors/ApiError'
import { connectDB } from '../src/config/db'
import morgan from 'morgan'

config()
export const app: Application = express()
//app.use(morgan('dev'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', ['https://gamevover.netlify.app', 'http://localhost:*']);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  connectDB()
  next();
});



app.use('/public',express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('healthe checkup')
})

app.use('/api/users', usersRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/products', productsRouter)
app.use('/api/categories', categoreisRouter)
app.use('/api/chat', chatRoute)



app.use((req, res, next) => {
  if (!req.route)
  return next(ApiError.badRequest(404, 'Rout not found'))
})
app.use(apiErrorHandler)

// app.listen(PORT, () => {
//   console.log('Server running http://localhost:' + PORT)

// })

  
export default app