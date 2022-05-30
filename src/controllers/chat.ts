import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Chat from "../models/Chat";
import User from "../models/User";
import { getCloudinary } from "../config/cloudinary";
import { isUserInGroup, checkIfUsersInGroup } from "../helpers";
import fs from "fs";

export const accessChats = async (req: Request, res: Response) => {
  const userId = req.user;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error:
        errors.array().length > 1
          ? errors.array()[1].msg
          : errors.array()[0].msg,
    });
  }

  try {
    const chattingUser = req.body.user;

    if(userId === chattingUser) {
        return res.status(400).json({
            success: false,
            error: "How can a person chat wth himself... Are you insane!!!!"
        });
    }

    const existingChat = await Chat.findOne({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: chattingUser } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-notificationToken -pinnedChats -providerId")
      .populate("latestMessage");

    if (existingChat) {
      return res.status(200).json({
        success: true,
        data: {
          chat: existingChat,
        },
      });
    }

    const isExistingUser = await User.findById(chattingUser);

    if (!isExistingUser) {
      return res.status(400).json({
        success: false,
        error: "No such user exists",
      });
    }

    const newChat = await Chat.create({
      chatName: "simple-chat",
      isGroupChat: false,
      users: [chattingUser, userId],
    });

    const chat = await Chat.findById(newChat.id).populate(
      "users",
      "-notificationToken -pinnedChats -providerId"
    );

    res.status(200).json({
        success: true,
        data: {
            chat
        }
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.msg ? error.msg : "Internal Server Error!!",
    });
  }
};

export const getAllChats = async (req: Request, res: Response) => {
  const userId = req.user;

  try{
    const chats = await Chat.find({users: {$elemMatch: {$eq: userId}}})
                        .populate("users", "-providerId -pinnedChats -notificationToken")
                        .populate("latestMessage")
                        .populate("groupAdmin", "-providerId -pinnedChats -notificationToken")
                        .sort({ updatedAt: -1 })

    res.status(200).json({
      success: true,
      data: {
        chats
      }
    });
  }
  catch(error: any) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message ? error.message : "Internal Server Error!!",
    });
  }
};

export const createGroup = async (req: Request, res: Response) => {
  const cloudinaryInstance = getCloudinary();

  const userId = req.user;
  const groupImage: any = req.files?.groupImage;
  const { chatName } = req.body;

  const users = JSON.parse(req.body.users);

  if(!chatName || chatName.length < 3 || chatName.length > 30){
    return res.status(400).json({
      success: false,
      error: "The group name should be at least 3 and at most 30 characters long"
    })
  }

  if(users.length < 2 || users.length > 49) {
    return res.status(400).json({
      success: false,
      error: "At least 3 members and at most 50 members are allowed!!"
    });
  }

  if(chatName.length < 3 || chatName.length > 30){
    return res.status(400).json({
      success: false,
      error: "The chat name should be at least 3 characters and at most 30 characters long"
    });
  }

  if(users.includes(userId)){
    return res.status(400).json({
      success: false,
      error: "You cannot be there in the group 2 times...."
    });
  }

  users.unshift(userId);


  try{
    let groupImageUrl = "https://thumbs.dreamstime.com/b/people-icon-vector-group-chat-assembly-point-team-158447407.jpg";

    if(groupImage){
      const groupImageResponse = await cloudinaryInstance.uploader.upload(groupImage?.tempFilePath, {
        folder: "chit-chats/group-image"
      });

      groupImageUrl = groupImageResponse.url
    }

    fs.unlink(groupImage.tempFilePath, err => console.log(err));

    const newGroup = await Chat.create({
      chatName,
      users,
      isGroupChat: true,
      groupAdmin: userId,
      groupImage: groupImageUrl
    });
    
    //TODO: If required decide to populate the field users and admin here by querying the db...

    res.status(200).json({
      success: true,
      data: {
        group: newGroup
      }
    })
  }
  catch(error: any){
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error!!"
    });
  }
};

export const updateGroupName = async(req: Request, res: Response) => {
  const userId = req.user;

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(400).json({
      success: false,
      error: errors.array().length > 1 ? errors.array()[1].msg : errors.array()[0].msg
    });
  }

  try{
    const {chatName, groupId} = req.body;

    const group = await Chat.findById(groupId);

    if(!group?.isGroupChat){
      return res.status(400).json({
        success: false,
        error: "Its not a group"
      });
    }

    if(group.groupAdmin.toString() !== userId){
      return res.status(401).json({
        success: false,
        error: "Access Denied"
      });
    }

    const newGroupData = {
      chatName
    }

    const updateGroup = await Chat.findByIdAndUpdate(groupId, {$set: newGroupData}, {new: true});

    res.status(200).json({
      success: true,
      data: {
        newGroupName: updateGroup?.chatName
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
};

export const updateGroupImage = async(req: Request, res: Response) => {
  const userId = req.user;

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(400).json({
      success: false,
      error: errors.array().length > 1 ? errors.array()[1].msg : errors.array()[0].msg
    });
  }

  const { groupId } = req.body;
  const groupImage: any = req.files?.groupImage;

  try{
    const group = await Chat.findById(groupId);

    if(!group?.isGroupChat){
      return res.status(400).json({
        success: false,
        error: "Please try this on a valid group"
      });
    }

    if(group.groupAdmin.toString() !== userId){
      return res.status(401).json({
        success: false,
        error: "Access Denied!!"
      });
    }

    if(!groupImage){
      return res.status(400).json({
        success: false,
        error: "Please provide us with an image to update with"
      });
    }

    const oldImage = group.groupImage;
    const cloudinary = getCloudinary();

    const newGroupImageUrl = await cloudinary.uploader.upload(groupImage?.tempFilePath, {
      folder: "chit-chats/group-image"
    });

    const updatedGroupData = {
      groupImage: newGroupImageUrl.url
    };

    const updateGroup = await Chat.findByIdAndUpdate(groupId, {$set: updatedGroupData}, {new: true});

    fs.unlink(groupImage.tempFilePath, err => console.log(err));

    if(oldImage && oldImage.includes("https://thumbs.dreamstime.com")){
      return res.status(200).json({
        success: true,
        data: {
          image: updateGroup?.groupImage
        }
      });
    }

    const deletionTarget = "chit-chats/group-image/" + oldImage?.split("/")[oldImage.split("/").length - 1].split(".")[0]

    await cloudinary.uploader.destroy(deletionTarget);

    res.status(200).json({
      success: true,
      data: {
        image: updateGroup?.groupImage
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
};

export const leaveGroup = async(req: Request, res: Response) => {
  const userId = req.user;

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(400).json({
      success: false,
      error: errors.array().length > 1 ? errors.array()[1].msg : errors.array()[0].msg
    });
  }

  const { groupId } = req.body;

  try{
    const group = await Chat.findById(groupId);

    if(!group?.isGroupChat){
      return res.status(400).json({
        success: false,
        error: "Please try this on a valid group"
      });
    }

    if(!isUserInGroup(group.users, userId)){
      return res.status(401).json({
        success: false,
        error: "Bro... join the group first... man..."
      });
    }

    if(group.groupAdmin.toString() === userId){
      return res.status(200).json({
        success: false,
        error: "An admin cannot leave the group... please make another person admin first..."
      });
    }

    const newUserList = group.users.filter((user) => user.toString() !== userId)

    const updatedGroupData = {
      users: newUserList
    };

    await Chat.findByIdAndUpdate(groupId, {$set: updatedGroupData}, {new: true});

    res.status(200).json({
      success: true
    });
  }
  catch(error){
    console.log(error);

    return res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
};

export const removeUser = async(req: Request, res: Response) => {
  const userId = req.user;

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(400).json({
      success: false,
      error: errors.array().length > 1 ? errors.array()[1].msg : errors.array()[0].msg
    });
  }

  const { groupId, targetUserId } = req.body;

  try{
    const group = await Chat.findById(groupId);

    if(!group?.isGroupChat){
      return res.status(400).json({
        success: false,
        error: "Please apply this things on a group"
      });
    }

    if(group.groupAdmin.toString() !== userId){
      return res.status(401).json({
        success: false,
        error: "Bro first become an admin"
      });
    }

    if(group.groupAdmin.toString() === targetUserId){
      return res.status(400).json({
        success: false,
        error: "An admin cannot leave the group"
      });
    }

    if(!isUserInGroup(group.users, targetUserId)){
      return res.status(400).json({
        success: false,
        error: "No such user exist in the group"
      });
    }

    const newUpdatedGroup = {
      users: group.users.filter((user) => user.toString() !== targetUserId)
    }

    await Chat.findByIdAndUpdate(groupId, {$set: newUpdatedGroup}, {new: true});

    res.status(200).json({
      success: true
    })
  }
  catch(error){
    console.log(error);

    return res.status(500).json({
      success: false,
      error: "Internal Server Error!!"
    });
  }
}

export const addUsers = async(req: Request, res: Response) => {
  const userId = req.user;

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(400).json({
      success: false,
      error: errors.array().length > 1 ? errors.array()[1].msg : errors.array()[0].msg
    });
  }

  const { groupId, targetUsers } = req.body;

  try{
    const group = await Chat.findById(groupId);

    if(!group?.isGroupChat){
      return res.status(400).json({
        success: false,
        error: "Please try on valid group"
      });
    }

    if(group.groupAdmin.toString() !== userId){
      return res.status(401).json({
        success: false,
        error: "Bro... please become an admin first..."
      });
    }

    if(checkIfUsersInGroup(group.users, targetUsers)){
      return res.status(400).json({
        success: false,
        error: "Some users already exist in the group"
      });
    }

    const updatedGroupData = {
      users: [...group.users, ...targetUsers]
    };

    await Chat.findByIdAndUpdate(groupId, {$set: updatedGroupData}, {new: true});

    res.status(200).json({
      success: true
    });
  }
  catch(error){
    console.log(error);

    res.status(500).json({
      success: false,
      error: "Internal Server Error!!"
    });
  }
}