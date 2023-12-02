import mongoose, { Document } from 'mongoose'

export type OrderDocument = Document & {
  name: string
  products: mongoose.Schema.Types.ObjectId[]
}

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },

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
    totalPriceOfOrder: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model<OrderDocument>('Order', orderSchema)
