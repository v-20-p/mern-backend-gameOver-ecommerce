import { NextFunction, Request, Response } from 'express'

import Order from '../models/orderSchema'
import { Product } from '../models/productSchema'
import braintree from "braintree";
import { dev } from '../config';
import ApiError from '../errors/ApiError';




const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: dev.payment.merchantId,
  publicKey: dev.payment.publicKey,
  privateKey: dev.payment.privateKey,
});
export const placeOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, user, products ,nonce,total} = req.body
    console.log(status, user, products ,nonce,total)

    const result =await gateway.transaction
  .sale({
    amount: (total),
    paymentMethodNonce: nonce,
    options: {
      submitForSettlement: true,
    },
  })

    if (result.success) {
      
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
    } else {
      throw ApiError.badRequest(400,result.message);
    }



    
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
    res.status(201).json({orders:orders})
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




export const generatePaymentToken = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const paymentClientToken=await gateway.clientToken.generate({})
    if(!paymentClientToken){
      throw ApiError.badRequest(400,'paymet token is not generate')
    }
    res.status(200).send(paymentClientToken)
  } catch (error) {
    next(error)
  }
}
