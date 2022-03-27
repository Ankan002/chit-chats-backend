import type {Request, Response} from 'express';
import User from '../models/User';

export const getUser = async(req: Request, res: Response) => {
    const userId = req.user;

    try{
        const user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                success: false,
                error: 'No such user found'
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error!!'
        });
    };
};