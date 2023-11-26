import mongoose, { Document } from 'mongoose'

export type OrderDocument = Document & {
  name: string
  products: mongoose.Schema.Types.ObjectId[]
}

const orderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    totalPriceOfOrder:{
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

export default mongoose.model<OrderDocument>('Order', orderSchema)
