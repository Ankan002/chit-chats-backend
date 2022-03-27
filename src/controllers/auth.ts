import dotenv from 'dotenv';
import type {Request, Response} from 'express';

import {Result, validationResult} from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User';

dotenv.config();

export const login = async(req: Request, res: Response) => {
    const errors: Result = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({
            success: false,
            error: (errors.array())[1].msg
        });
    }

    const {name, email, username, providerId, image} = req.body;

    try{
        const existingUser = await User.findOne({
            providerId
        });

        if(existingUser){
            const data = {
                user: existingUser._id
            };

            const token = jwt.sign(data, process.env.SECRET ?? '');

            return res.status(200).set({
                'authToken': token
            }).json({
                success: true
            });
        }

        const user = await User.create({
            name,
            username,
            email,
            providerId,
            image
        });

        const data = {
            user: user._id
        };

        const token = jwt.sign(data, process.env.SECRET ?? '');

        res.status(200).set({
            'authToken': token
        }).json({
            success: true
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