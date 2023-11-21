import express from 'express'
const router = express.Router()

import Order from '../models/order'
import {Users} from '../models/user'

router.get('/', async (req, res) => {
  const orders = await Order.find().populate('products','user')
  res.json(orders)
})

router.post('/', async (req, res, next) => {
  const { name, user ,products } = req.body

  const order = new Order({
    name,
    user,
    products,
  })
  console.log('orderId:', order._id)
  await order.save();

  const updateUser=await Users.findOneAndUpdate(
    {_id:user},
   { orders:  order } ,
    {new:true}
);
if(updateUser)
 await updateUser.save()
  res.json(order)
})

export default router
