
import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  message: String,
  user: String,
});

export const Chat = mongoose.model('Chat', chatSchema);