// routes/chatRoutes.js
import express from 'express';
import { Chat } from '../models/chat';
import { handleUserMessage } from '../openaiIntegration';
import nodemailer from 'nodemailer'

export const chatRoute = express.Router();

chatRoute.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    // Save user's message to MongoDB
    const userMessage = new Chat({ message, user: 'user' });
    await userMessage.save();
    // Process user's message using OpenAI
    const openaiResponse = await handleUserMessage(message);

    // Respond to the user with the OpenAI-generated message
    const botMessage = new Chat({ message: openaiResponse, user: 'bot' });
    await botMessage.save();

    res.json({ botMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

