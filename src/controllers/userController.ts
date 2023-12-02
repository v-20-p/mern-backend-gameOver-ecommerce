import { Request, Response, NextFunction } from 'express';
import { Users } from '../models/user';
import  Jwt  from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import { sendEmail } from '../services/emailServices';
import { dev } from '../config';
import ApiError from '../errors/ApiError';
import { deleteImage } from '../services/deleteImageService';




const generateToken = (encodedData:any) => {
  return Jwt.sign(encodedData , dev.app.secret_key, {
    expiresIn: '3h',
  })
}


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
        res.cookie('access_token', generateToken({_id:user._id}), {
            maxAge: 15 * 60 * 1000, //15 minutes
            httpOnly: true,
            sameSite: 'none',
          })


        res.status(200).send({
            message: 'User login successfully.',
           
        });
    } catch (error) {
      console.log(error)
        next(error);
    }
};
export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie('access_token')
        res.status(200).send({
            message: 'User logout successfully.',
           
        });
    } catch (error) {
        next(error);
    }
};
export const updateBan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userName = req.params.userName
      const user = await Users.findOne({ userName: userName })
      if (!user) {
        throw ApiError.badRequest(404, 'User was not found')
      }
       user.isBan= !user.isBan
       await user.save()

      res.status(200).send({
        message: 'User status is updated',
      })
    } catch (error) {
      next(error)
    }
  }

  export const deleteSingleUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userName = req.params.userName
      const user = await Users.findOneAndDelete({ userName: userName })
      if (!user) {
        throw ApiError.badRequest(404,`user not found with this user name ${userName}`)
      }
      if (user && user.image) {
        await deleteImage(user.image)
      }
      res.status(200).json({
        message: `delete user with user name ${userName}`,
      })
    } catch (error) {
        next(error)
    }
  }





