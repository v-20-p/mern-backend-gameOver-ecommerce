import { check, param } from 'express-validator'
import { Users } from '../models/user'
import Order from '../models/order'
import order from '../models/order'
import { Request } from 'express'
export const validateuser = [
  check('userName').optional()
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
export const validateIdProduct = [check('id').isNumeric().withMessage('id must be a number')]

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
