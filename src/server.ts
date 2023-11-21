import express,{Application, } from 'express';
import createHttpError from 'http-errors'

import mongoose from 'mongoose'
import { config } from 'dotenv'
import {dev} from './config'
import { connectDB } from './config/db';

import usersRouter from './routers/users'
import productsRouter from './routers/products'
import ordersRouter from './routers/orders'
import apiErrorHandler from './middlewares/errorHandler'
import myLogger from './middlewares/logger'
import morgan from 'morgan'

//  config()
 const app:Application= express();
 const port:number =dev.app.port;

// app.use(myLogger)
// app.use(express.urlencoded({ extended: true }))
// app.use(express.json())

// app.use('/api/users', usersRouter)
// app.use('/api/orders', ordersRouter)
// app.use('/api/products', productsRouter)
// mongoose
//   .connect(URL)
//   .then(() => {
//     console.log('Database connected')
//   })
//   .catch((err) => {
//     console.log('MongoDB connection error, ', err)
//   })

app.listen(port, () => {
  console.log('Server running http://localhost:' + port)
  connectDB()
})

app.get('/',(req,res)=>{
  res.json({message: 'health cheakup'})
})
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}));

app.use('/api/users', usersRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/products', productsRouter)
app.use((req,res,next)=>{
  createHttpError(404,"Not Found");
});
app.use(apiErrorHandler)

