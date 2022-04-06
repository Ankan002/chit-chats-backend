import type { Request, Response } from "express";
import User from "../models/User";
import { isValidUsername } from "../helpers";
import { validationResult, Result } from "express-validator";
import { UsernameUpdateRequest, UserTaglineUpdateRequest } from "../types/User/UserUpdateRequest";

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

export const updateUsername = async (req: Request, res: Response) => {
  const userId = req.user;

  const errors: Result = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array()[0]?.msg,
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
            error: errors.array()[0]?.msg,
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
