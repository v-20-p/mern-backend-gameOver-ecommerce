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
  payment: {
    merchantId: String(process.env.merchantId),
    publicKey: String(process.env.publicKey),
    privateKey: String(process.env.privateKey),

  },
}
export const baseURL = 'https://sda-online-mern-backend-ecommerce.vercel.app/'
