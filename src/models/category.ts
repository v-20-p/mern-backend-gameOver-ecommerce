import { Schema, model } from 'mongoose'

export const categorySchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      minlength: [3, 'Category title must be at least 3 caracters'],
      maxlength: [100, 'Category title must be at most 100 caracters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true }
)
export const Category = model('Categories', categorySchema)
