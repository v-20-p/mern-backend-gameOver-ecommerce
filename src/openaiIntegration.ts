// openaiIntegration.js
import { OpenAI } from 'openai';
import { Product } from './models/productSchema';
import { dev } from './config';

const OPENAI_API_KEY = `${dev.app.chatbot.apiKey}`; 

export async function handleUserMessage(message: string) {
  try {
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

  
    const products = await Product.find({});

    const prompt = `${products} based on this data talk about title and  description only for custmor for this message from the user : '${message}' `;

    const response = await openai.completions.create({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 50, 
    });

    const openaiResponse = response.choices[0]?.text.slice(4) || 'No response from OpenAI.';
    return openaiResponse;
  } catch (error: any) {
    console.error('Error interacting with OpenAI:', error.message);
    throw error;
  }
}
