import { CategoryInterface } from "./models/category";

export interface ErrorInterface {
    status?: number;
    message?: string
}

export type ProductInput = {
  title: string
  price: number
  category: CategoryInterface['id']; //import from categorySchema
  image: string
  description: string
  quantity: number
  sold: number
  shipping: number
}
