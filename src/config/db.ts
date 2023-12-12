import mongoose from 'mongoose'
import { dev } from '.'

export const connectDB = async () => {
  try {
    await mongoose.set('strictQuery', true);
    await mongoose.connect(dev.db.url)
  } catch (error) {
    console.error(error)
  }
}
