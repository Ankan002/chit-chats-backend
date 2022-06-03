import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../models/User";
import Chat from "../models/Chat";
import Message from "../models/Message";
import { getCloudinary } from "../config/cloudinary";
import fs from "fs";

export const sendMessage = async(req: Request, res: Response) => {
    const userId = req.user;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            success: false,
            error: (errors.array().length > 1) ? errors.array()[1].msg : errors.array()[0].msg
        });
    }

    try{
        const {chatId, content} = req.body;

        let newMessage = await Message.create({
            sender: userId,
            content,
            chat: chatId
        });

        newMessage = await newMessage.populate("sender", "username image name");
        newMessage = await newMessage.populate("chat");

        let message = await User.populate(newMessage, {
            path: "chat.users",
            select: "_id __v createdAt updatedAt name email image username tagline"
        });

        message = await User.populate(newMessage, {
            path: "chat.groupAdmin",
            select: "_id __v createdAt updatedAt name email image username tagline"
        });

        await Chat.findByIdAndUpdate(chatId, {$set: {latestMessage: message._id}}, {new: true});

        res.status(200).json({
            success: true,
            data: {
                message
            }
        });
    }
    catch(error){
        console.log(error);

        return res.status(500).json({
            success: false,
            error: "Internal Server Error!!"
        });
    }

}

export const sendMediaMessage = async(req: Request, res: Response) => {
    const userId = req.user;
    const media: any = req.files?.media;
    const { content, chatId } = req.body;

    if(!media){
        return res.status(400).json({
            success: false,
            error: "No media file found, try sending plain message via another route"
        });
    }

    if(content.length < 5 || content.length > 400){
        return res.status(400).json({
            success: false,
            error: "Message Content should be at least 5 characters long and at most 400 characters long"
        });
    }

    const cloudinary = getCloudinary();

    try{
        const image = await cloudinary.uploader.upload(media?.tempFilePath, {
            folder: "chit-chats/chat-media"
        });

        let newMessage = await Message.create({
            chat: chatId,
            content,
            media: image.url,
            sender: userId
        });

        newMessage = await newMessage.populate("sender", "username image name");
        newMessage = await newMessage.populate("chat");

        let message = await User.populate(newMessage, {
            path: "chat.users",
            select: "__v _id username name image tagline email createdAt updatedAt"
        });

        message = await User.populate(newMessage, {
            path: "chat.groupAdmin",
            select: "__v _id name username email image tagline updatedAt createdAt"
        });

        await Chat.findByIdAndUpdate(chatId, {$set: {latestMessage: message._id}}, {new: true});

        fs.unlink(media.tempFilePath, err => console.log(err));

        res.status(200).json({
            success: true,
            data: {
                message
            }
        });
    }
    catch(error: any){
        console.log(error);

        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
}

export const getMessages = async(req: Request, res: Response) => {

    const chatId = req.params.chatId;
    const pageNumber = parseInt((req.query.page?.toString()) ?? "1");
    const numberOfMessages = parseInt((req.query.messages?.toString()) ?? "15");

    //TODO: If required populate it with chatsId `.populate("chat")`

    try{
        let chats = await Message.find({chat: chatId}).sort("-createdAt").limit(numberOfMessages).skip(numberOfMessages * (pageNumber - 1)).populate("sender", "username name image");

        res.status(200).json({
            success: true,
            data: {
                chats
            }
        });
    }
    catch(error){
        console.log(error);

        return res.status(500).json({
            success: false,
            error: "Internal Server Error!!"
        });
    }
}