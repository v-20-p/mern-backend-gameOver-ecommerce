import 'dotenv/config'
export const dev = {
  app: {
    port: Number(process.env.PORT) || 3003,
    secret_key: String(process.env.secret_key),
    access_key: String(process.env.access_key),
    chatbot: { apiKey: process.env.botapi },

  },
  db: {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017/sda-ecommerce-db',
  },
  cloud: {
    cloudinaryName: process.env.CLOUDINARY_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET_KEY,
  },
}
export const baseURL = 'http://localhost:5050/'
