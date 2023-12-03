import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
  message: [{ sender: String, content: String }],
  user: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'users',
  },
})

export const Chat = mongoose.model('Chat', chatSchema)
