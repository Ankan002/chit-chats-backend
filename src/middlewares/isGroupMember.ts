import { Request, Response, NextFunction } from "express";
import Chat from "../models/Chat";

export const isGroupMember = async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user
    const { chatId } = req.body;

    try{
        const fetchedChat = await Chat.findById(chatId);

        if(!chatId){
            return res.status(400).json({
                success: false,
                error: "Please provide us with a valid groupId"
            });
        }

        let isUserFound = false

        for(let user of fetchedChat?.users ?? []){
            if(user.toString() === userId){
                isUserFound = true;
                break;
            }
        }

        if(!isUserFound){
            return res.status(401).json({
                success: false,
                error: "You are not a part of this group"
            }); 
        }

        next();
    }
    catch(error){
        console.log(error);

        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
};


export const isGroupMemberByParams = async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user
    const { chatId } = req.params;

    try{
        const fetchedChat = await Chat.findById(chatId);

        if(!chatId){
            return res.status(400).json({
                success: false,
                error: "Please provide us with a valid groupId"
            });
        }

        let isUserFound = false

        for(let user of fetchedChat?.users ?? []){
            if(user.toString() === userId){
                isUserFound = true;
                break;
            }
        }

        if(!isUserFound){
            return res.status(401).json({
                success: false,
                error: "You are not a part of this group"
            }); 
        }

        next();
    }
    catch(error){
        console.log(error);

        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
};