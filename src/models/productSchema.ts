import { Schema, model, Document } from 'mongoose'

export interface ProductInterface extends Document {
  id: string
  name: string
  slug: string
  price: number
  //category: CategoryInterface['id']; //import from categorySchema
  image: string
  description: string
  quantity: number
  sold: number
  shipping: number
  createdAt?: string
  updatedAt?: string
}

const productSchema = new Schema(
  {
    name: {
      type: String,
      //index: true, //beneficial for fields that are used for filtering or sorting data.
      required: true,
      trim: true,
      minlength: [3, 'Product name must be at least 3 characters'],
      maxlength: [50, 'Product name must be at most 50 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, 'Product description must be at least 3 characters'],
      maxlength: [300, 'Product description must be at most 300 characters'],
    },
    image: {
      type: String,
      default: 'public/images/productsImages/defaultProductImage.png',
    },
    // category: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Category',
    //     required: true
    // }, //make a relationship between Product and Category
    quantity: {
      type: Number,
      required: true,
      trim: true,
    },
    sold: {
      type: Number,
      default: 0,
      trim: true,
    },
    shipping: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

export const Product = model<ProductInterface>('Product', productSchema)
