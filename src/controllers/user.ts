import type { Request, Response } from "express";
import User from "../models/User";
import { isValidUsername } from "../helpers";
import { validationResult, Result } from "express-validator";
import { UsernameUpdateRequest, UserTaglineUpdateRequest } from "../types/User/UserUpdateRequest";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLODINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const getUser = async (req: Request, res: Response) => {
  const userId = req.user;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "No such user found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error!!",
    });
  }
};

export const searchUser = async (req: Request, res: Response) => {
  const userId = req.user;
  const keyword = req.query.keyword ? {
    $or: [
      {username: {$regex: req.query.keyword, $options: "i"}},
    ]
  } : {};

  try{
    const users = await User.find(keyword).find({_id: {$ne: userId}}).select("-notificationToken").select("-pinnedChats").select("-providerId");

    res.status(200).json({
      success: true,
      data: {
        users
      }
    });
  }
  catch(error){
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error" 
    });
  }
}

export const updateUsername = async (req: Request, res: Response) => {
  const userId = req.user;

  const errors: Result = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: (errors.array().length > 1) ? (errors.array())[1].msg : (errors.array())[0].msg
    });
  }

  try {
    const { username } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User with same username exists!!",
      });
    }

    const updatedUser: UsernameUpdateRequest = {};

    if (!isValidUsername(username)) {
      return res.status(400).json({
        success: false,
        error: "Invalid Username!!",
      });
    }

    if (username) updatedUser.username = username;

    const updatedUserWithUsername = await User.findByIdAndUpdate(
      userId,
      { $set: updatedUser },
      { new: true }
    ).select("username");

    res.status(200).json({
        success: true,
        username: updatedUserWithUsername?.username
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error!!",
    });
  }
};

export const updateTagline = async(req: Request, res: Response) => {
    const userId = req.user;

    const errors: Result = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            success: false,
            error: (errors.array().length > 1) ? (errors.array())[1].msg : (errors.array())[0].msg
        });
    }

    try{
        const {tagline} = req.body;

        const updatedUserTagline: UserTaglineUpdateRequest = {};

        if(tagline) updatedUserTagline.tagline = tagline;

        const updatedUser = await User.findByIdAndUpdate(userId, {$set: updatedUserTagline}, {new: true}).select("tagline");

        res.status(200).json({
          success: true,
          tagline: updatedUser?.tagline
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

export const updateProfilePicture = async (req: Request, res: Response) => {
  const userId = req.user;
  const image: any = req.files?.image;

  try{
    const cloudinaryUploadResponse = await cloudinary.uploader.upload(image?.tempFilePath, {
      folder: "chit-chats/profile-image"
    });

    const user = await User.findById(userId).select("image");

    const oldImage = user?.image;

    const updatedData = {
      image: cloudinaryUploadResponse.url
    }

    const newUser = await User.findByIdAndUpdate(userId, {$set: updatedData}, {new: true}).select("image");

    fs.unlink(image.tempFilePath, err => console.log(err));

    if(oldImage?.includes("lh3.googleusercontent.com")){
      return res.status(200).json({
        success: true,
        data: {
          image: newUser?.image
        }
      });
    }

    const deletionTarget = "chit-chats/profile-image/" + oldImage?.split("/")[oldImage.split("/").length - 1].split(".")[0];

    await cloudinary.uploader.destroy(deletionTarget);

    res.status(200).json({
      success: true,
        data: {
          image: newUser?.image
        }
    });
  }
  catch(error){
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
}
