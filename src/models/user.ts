import { Schema, model, Document } from "mongoose";

export interface UserInterface extends Document {
  username: string;
  name: string;
  email: string;
  password: string;
  image: string;
  isAdmin: boolean;
  isBan: boolean;
  wishList: Schema.Types.ObjectId;
  orders: Schema.Types.ObjectId;
}

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique:true
  },
  name: {
    type: String,
    required: true,
  },
  email:{
    type:String,
    required: true,
  },
  password:{
    type:String,
    required: true,
  },
  image:{
    type:String,
    default:'public/images/usersimages/default_user.png'
  },
  isAdmin:{
    type:Boolean,
    default:false
  },
  isBan:{
    type:Boolean,
    default:false
  },
  wishList:[{
    type: [Schema.Types.ObjectId],
    ref: 'Product',
  }],
  orders: [{
    type: [Schema.Types.ObjectId],
    ref: 'Order',
  }]
});

export const User = model<UserInterface>('User', userSchema)
