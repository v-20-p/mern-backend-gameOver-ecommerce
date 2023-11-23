import { NextFunction, Request, Response } from 'express'
import slugify from 'slugify'
import Order from '../models/order'
import Product from '../models/product'

export const deleteOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findOneAndDelete({ _id: req.params.orderId })
    res.send({ message: 'deleted a single order', payload: order })
  } catch (error) {
    next(error)
  }
}

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  const orders = await Order.find().populate('products.product')
  res.json(orders)
}

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.find({ _id: req.params.orderId }).populate('products.product')
    res.send({ message: 'returned single order', payload: order })
  } catch (error) {
    next(error)
  }
}

export const placeOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, user, products } = req.body
    let totalPriceOfItems = 0
    for (let item = 0; item < products.length; item++) {
      const { product, quantity } = products[item]

      const productInfo = await Product.findById(product)

      // Check if the product exists
      if (!productInfo) {
        return res.status(404).send({ message: `Product of id ${product} not found.` })
      }

      // Check if there is enough stock
      if (productInfo.quantity < quantity) {
        return res
          .status(400)
          .send({ message: 'Not enough stock available for this product.', product })
      }
      totalPriceOfItems += productInfo.price
    }

    // Create a new order
    const order = new Order({
      name,
      user,
      products: products,
      slug: slugify(name),
      totalPriceOfOrder: totalPriceOfItems,
    })

    // Update product stock (quantity)
    products.map(async (item: typeof products) => {
      const { product, quantity } = item
      const productInfo = await Product.findById(product)
      if (productInfo) {
        const valuofUpdateQuantity = (productInfo.quantity -= quantity)
        const updateQuantity = await Product.findOneAndUpdate(
          { _id: product },
          { quantity: valuofUpdateQuantity },
          { new: true }
        )
        if (updateQuantity) {
          await updateQuantity.save()
        }
      }
    })

    await order.save()
    res.status(201).send({ message: 'Order placed successfully.', order })
  } catch (error) {
    next(error)
  }
}
