import moogoose from 'mongoose'
import { dev } from '.'

export const connectDB = async () => {
  try {
    await moogoose.connect(dev.db.url)
  } catch (error) {
    console.error(error)
  }
}
