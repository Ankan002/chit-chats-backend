import dotenv from 'dotenv';
import type {Response, NextFunction, Request, RequestHandler} from 'express';
import jwt from 'jsonwebtoken';

dotenv.config();

export const fetchUser = async(req: Request, res: Response, next: NextFunction) => {
    const token = req.header('auth-token');

    if(!token){
        return res.status(401).json({
            success: false,
            message: 'Access Denied!!'
        });
    }

    try{
        const data: any = jwt.verify(token, process.env.SECRET ?? '');

        req.user = data.user;
        next();
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error!!'
        });
    }
};