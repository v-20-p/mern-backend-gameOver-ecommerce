import 'dotenv/config'
export const dev = {
  app: {
    port: Number(process.env.PORT) || 3003,
    jwtUserActivationKey: process.env.JWT_USER_ACTIVATION_KEY || 'shhhhh',
    jwtAccessKey: process.env.JWT_ACCESS_KEY || 'shhhhh',
    secret_key: 'group7'
  },
  db: {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017/sda-ecommerce-db',
  },
}
