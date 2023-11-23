import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique:true
  },
  name: {
    type: String,
    required: true,
  },


  isAdmin:{
    type:Boolean,
    default:false
  },
  
  isBan:{
    type:Boolean,
    default:false
  },
  
 

  // relation between order and user should be many orders to one user
  // here's 1to1 just for the demo
  orders: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Order',}
  

});

export const Users=mongoose.model('users', userSchema)
