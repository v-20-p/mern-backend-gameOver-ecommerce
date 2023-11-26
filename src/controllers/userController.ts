import { Request, Response, NextFunction } from 'express';
import { Users } from '../models/user';

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
        const userName = req.params.userName; // Assuming you pass the user ID in the request parameters
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
        const { name, userName, isAdmin, isBan } = req.body;
        const newUser = new Users({
            name,
            userName,
            isAdmin,
            isBan,
        });
        await newUser.save();
        res.status(201).send({
            message: 'User created successfully.',
            user: newUser,
        });
    } catch (error) {
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
