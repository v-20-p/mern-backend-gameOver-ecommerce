import express, { Router } from 'express'

import {
  deleteOrderById,
  getAllOrders,
  getOrderById,
  placeOrder,
  updateOrderById,
} from '../controllers/orderController'
import { runValidation } from '../middlewares/runVaildator'
import { validateIdOrder } from '../middlewares/validator'

const router = express.Router()

//GET: /api/orders -> return all orders
router.get('/', getAllOrders)

//POST: /api/orders -> create order
router.post('/', placeOrder)

//GET: /api/orders:orderId -> return detail of single order
router.get('/:orderId', validateIdOrder, runValidation, getOrderById)

//PUT: /api/orders:orderId -> update status info of single order
router.put('/:orderId', validateIdOrder, runValidation, updateOrderById)

//DELETE: /api/orders:orderId -> delete single order by Id
router.delete('/:orderId', validateIdOrder, runValidation, deleteOrderById)

export default router
