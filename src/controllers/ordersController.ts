import { NextFunction, Request, Response } from 'express'

import Order from '../models/orderSchema'
import { Product } from '../models/productSchema'

export const placeOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, user, products } = req.body
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
      status,
      user,
      products: products,
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

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find().populate('products.product')
    if (!orders) {
      return res.status(404).send({ message: 'list of Orders not found' })
    }
    res.status(201).json(orders)
  } catch (error) {
    next(error)
  }
}

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.find({ _id: req.params.orderId }).populate('products.product')
    res.status(201).send({ message: 'returned single order', payload: order })
  } catch (error) {
    next(error)
  }
}
export const deleteOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findOneAndDelete({ _id: req.params.orderId })
    res.status(201).send({ message: 'deleted a single order', payload: order })
  } catch (error) {
    next(error)
  }
}

export const updateOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findOneAndUpdate({ _id: req.params.orderId }, req.body, { new: true })
    if (!order) {
      throw new Error('Order not found with this ID')
    }
    res.send({ message: 'update a single product ', payload: order })
  } catch (error) {
    next(error)
  }
}
