import { check, param } from 'express-validator'
import { Users } from '../models/userSchema'
import Order from '../models/orderSchema'
import order from '../models/orderSchema'
import { Request } from 'express'
import { Product } from '../models/productSchema'

export const validateuser = [
  check('userName')
    .optional()
    .notEmpty()
    .withMessage('Username must not be empty')
    .custom(async (value: string) => {
      if (value.includes(' ')) {
        throw new Error('Username must not contain spaces')
      }
      // Check if the username is already in use
      const existingUser = await Users.findOne({ userName: value })
      if (existingUser) {
        throw new Error('Username is already in use')
      }

      return true
    }),
  check('password').optional().notEmpty().withMessage('password is required'),
  check('email').optional().notEmpty().isEmail().withMessage('invalid email'),
  check('name').optional().notEmpty().withMessage('Name is required'),
  check('isAdmin').optional().isBoolean().withMessage('isAdmin must be a boolean'),
  check('isBan').optional().isBoolean().withMessage('isBan must be a boolean'),
]

export const validateCreateProduct = [
  check('title')
    .notEmpty()
    .withMessage('Product title is required')
    .isLength({min: 3, max: 50})
    .withMessage('Product title must be 3-50 characters')
    .custom(async (value: string) => {
      // Check if the product is already in use
      const existingProduct = await Product.findOne({ title: value })
      if (existingProduct) {
        throw new Error('There is already product with the same title')
      }

      return true
    }),
  check('price').notEmpty().withMessage('Price is required'),
  check('description').notEmpty().withMessage('Description is required'),
  check('categoryId').notEmpty().withMessage('Category ID is required'),
  check('quantity').notEmpty().withMessage('Quantity is required'),
  check('shipping').notEmpty().withMessage('Shipping is required'),
]

export const validateUpdateProduct = [
  check('title').notEmpty().withMessage('Product title is required').isLength({min: 3, max: 50})
  .withMessage('Product title must be 3-50 characters'),
  check('price').notEmpty().withMessage('Price is required'),
  check('description').notEmpty().withMessage('Description is required'),
  check('categoryId').notEmpty().withMessage('Category ID is required'),
  check('quantity').notEmpty().withMessage('Quantity is required'),
  check('shipping').notEmpty().withMessage('Shipping is required'),
]

export const validateDiscount = [
  check('type').notEmpty().withMessage('Please provide type of discount (percentage or fixed)').isIn(['percentage', 'fixed'])
  .withMessage('Please provide a vlaid discount type'),
  check('value').notEmpty().withMessage('Discount value is required'),
  check('start').notEmpty().withMessage('Start date is required'),
  check('end').notEmpty().withMessage('End date is required'),
]

export const validateIdOrder = [
  param('orderId')
    .exists()
    .custom(async (value: string) => {
      // DB not accept query ID that have length less than 24
      if (value.length != 24) {
        throw new Error('You enter wrong format of Order ID')
      }

      // Check if the ID is already in the orders list
      const existingOrder = await Order.findOne({ _id: value })

      if (existingOrder == undefined) {
        throw new Error('Order not found with this ID')
      }

      return true
    }),
]
