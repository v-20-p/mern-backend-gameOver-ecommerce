import { ProductInterface } from '../models/productSchema'

export const discount = async (product: ProductInterface) => {
  const currentDate = new Date()
  const activeDiscount = product.discounts.find(
    (discount) => currentDate >= discount.start && currentDate <= discount.end
  )

  let dynamicPrice = product.price

  if (activeDiscount) {
    if (activeDiscount.type === 'percentage') {
      dynamicPrice -= (product.price * activeDiscount.value) / 100
    } else if (activeDiscount.type === 'fixed') {
      dynamicPrice -= activeDiscount.value
    }
    product.price = dynamicPrice
  }

  return product
}
