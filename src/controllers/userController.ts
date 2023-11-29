import { Request, Response, NextFunction } from 'express';
import { Users } from '../models/user';
import  Jwt  from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import { sendEmail } from '../services/emailServices';
import { dev } from '../config';
import ApiError from '../errors/ApiError';



export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await Users.find();
        res.status(200).send({
            message: 'Successfully retrieved all users.',
            users,
        });
    } catch (error) {
        next(error);
    }
};

export const getOneUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userName = req.params.userName; 
        const user = await Users.findOne({userName});
        if (!user) {
            return res.status(404).send({
                message: 'User not found.',
            });
        }
        res.status(200).send({
            message: 'Successfully retrieved the user.',
            user,
        });
    } catch (error) {
        next(error);
    }
};

export const newUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { name, userName, isAdmin, isBan,email,password } = req.body;
        const image=req.file?.path
        let newUserBody={
            name,
            userName,
            isAdmin,
            isBan,
            image,
            email,
            password:await bcrypt.hash(password,7),      
        }
        if (image){
            newUserBody={...newUserBody,image}
        }
        const token = Jwt.sign(newUserBody,dev.app.secret_key,{expiresIn:'10m'})
         sendEmail(newUserBody.email,'activate your acount',
        `<h1>hi , ${name}</h1>
        <p>you can activate your acount <a href='http://localhost:5050/users/activate/${token}' >hare</a></p>
        <br>
        <p>if is not you please ignore this message</p>
        `)
        res.status(201).send({
            message: 'User created successfully.',
            token
        });
    } catch (error) {
        next(error);
    }
};

export const activateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;
  
      interface User {
        name: string;
        userName: string;
        image?: string | undefined;
        email: string;
        password: string;
      }
  
      const decodedToken = await Jwt.verify(token, dev.app.secret_key) ;
      if (!decodedToken) {
        throw ApiError.badRequest(403,'Token was invalid')
      }

  

      const user = new Users(decodedToken)
    await user.save()
  
      res.status(200).send({ message: 'User activated successfully.', user: decodedToken});
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        return res.status(400).send({ message: 'Activation token has expired. Please request a new one.' });
      }
  
      console.error('Error activating user:', error);
      next(error);
    }
  };
  
  
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.params.userName; 
        const { name, userName, isAdmin, isBan } = req.body;
        const updatedUser = await Users.findOneAndUpdate({user}, { name, userName, isAdmin, isBan }, { new: true });
        if (!updatedUser) {
            return res.status(404).send({
                message: 'User not found.',
            });
        }
        res.status(200).send({
            message: 'User updated successfully.',
            user: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email,password} = req.body; 
        
        const user = await Users.findOne({email});

        if (!user || user.isBan) {
            return res.status(404).send({
                message: 'User not found.',
            });
        }
        const isPasswordMatch= await bcrypt.compare(password,user.password)
        if(!isPasswordMatch){
            next('not vaild password')
        }
        const accessToken=Jwt.sign({_id:user._id},dev.app.secret_key,{expiresIn:'5m'})
        res.cookie('accessToken',accessToken,{
            maxAge: 5*60*1000,
            httpOnly:true,
            sameSite:'none'
        })


        res.status(200).send({
            message: 'User login successfully.',
           
        });
    } catch (error) {
        next(error);
    }
};
export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie('accessToken')
        res.status(200).send({
            message: 'User logout successfully.',
           
        });
    } catch (error) {
        next(error);
    }
};





