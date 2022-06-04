"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUsers = exports.removeUser = exports.leaveGroup = exports.updateGroupImage = exports.updateGroupName = exports.createGroup = exports.getAllChats = exports.accessChats = void 0;
const express_validator_1 = require("express-validator");
const Chat_1 = __importDefault(require("../models/Chat"));
const User_1 = __importDefault(require("../models/User"));
const cloudinary_1 = require("../config/cloudinary");
const helpers_1 = require("../helpers");
const fs_1 = __importDefault(require("fs"));
const accessChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: errors.array().length > 1
                ? errors.array()[1].msg
                : errors.array()[0].msg,
        });
    }
    try {
        const chattingUser = req.body.user;
        if (userId === chattingUser) {
            return res.status(400).json({
                success: false,
                error: "How can a person chat wth himself... Are you insane!!!!"
            });
        }
        const existingChat = yield Chat_1.default.findOne({
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
        const isExistingUser = yield User_1.default.findById(chattingUser);
        if (!isExistingUser) {
            return res.status(400).json({
                success: false,
                error: "No such user exists",
            });
        }
        const newChat = yield Chat_1.default.create({
            chatName: "simple-chat",
            isGroupChat: false,
            users: [chattingUser, userId],
        });
        const chat = yield Chat_1.default.findById(newChat.id).populate("users", "-notificationToken -pinnedChats -providerId");
        res.status(200).json({
            success: true,
            data: {
                chat
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.msg ? error.msg : "Internal Server Error!!",
        });
    }
});
exports.accessChats = accessChats;
const getAllChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user;
    try {
        const chats = yield Chat_1.default.find({ users: { $elemMatch: { $eq: userId } } })
            .populate("users", "-providerId -pinnedChats -notificationToken")
            .populate("latestMessage")
            .populate("groupAdmin", "-providerId -pinnedChats -notificationToken")
            .sort({ updatedAt: -1 });
        res.status(200).json({
            success: true,
            data: {
                chats
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message ? error.message : "Internal Server Error!!",
        });
    }
});
exports.getAllChats = getAllChats;
const createGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const cloudinaryInstance = (0, cloudinary_1.getCloudinary)();
    const userId = req.user;
    const groupImage = (_a = req.files) === null || _a === void 0 ? void 0 : _a.groupImage;
    const { chatName } = req.body;
    const users = JSON.parse(req.body.users);
    if (!chatName || chatName.length < 3 || chatName.length > 30) {
        return res.status(400).json({
            success: false,
            error: "The group name should be at least 3 and at most 30 characters long"
        });
    }
    if (users.length < 2 || users.length > 49) {
        return res.status(400).json({
            success: false,
            error: "At least 3 members and at most 50 members are allowed!!"
        });
    }
    if (chatName.length < 3 || chatName.length > 30) {
        return res.status(400).json({
            success: false,
            error: "The chat name should be at least 3 characters and at most 30 characters long"
        });
    }
    if (users.includes(userId)) {
        return res.status(400).json({
            success: false,
            error: "You cannot be there in the group 2 times...."
        });
    }
    users.unshift(userId);
    try {
        let groupImageUrl = "https://thumbs.dreamstime.com/b/people-icon-vector-group-chat-assembly-point-team-158447407.jpg";
        if (groupImage) {
            const groupImageResponse = yield cloudinaryInstance.uploader.upload(groupImage === null || groupImage === void 0 ? void 0 : groupImage.tempFilePath, {
                folder: "chit-chats/group-image"
            });
            groupImageUrl = groupImageResponse.url;
        }
        fs_1.default.unlink(groupImage.tempFilePath, err => console.log(err));
        const newGroup = yield Chat_1.default.create({
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
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error!!"
        });
    }
});
exports.createGroup = createGroup;
const updateGroupName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: errors.array().length > 1 ? errors.array()[1].msg : errors.array()[0].msg
        });
    }
    try {
        const { chatName, groupId } = req.body;
        const group = yield Chat_1.default.findById(groupId);
        if (!(group === null || group === void 0 ? void 0 : group.isGroupChat)) {
            return res.status(400).json({
                success: false,
                error: "Its not a group"
            });
        }
        if (group.groupAdmin.toString() !== userId) {
            return res.status(401).json({
                success: false,
                error: "Access Denied"
            });
        }
        const newGroupData = {
            chatName
        };
        const updateGroup = yield Chat_1.default.findByIdAndUpdate(groupId, { $set: newGroupData }, { new: true });
        res.status(200).json({
            success: true,
            data: {
                newGroupName: updateGroup === null || updateGroup === void 0 ? void 0 : updateGroup.chatName
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
});
exports.updateGroupName = updateGroupName;
const updateGroupImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userId = req.user;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: errors.array().length > 1 ? errors.array()[1].msg : errors.array()[0].msg
        });
    }
    const { groupId } = req.body;
    const groupImage = (_b = req.files) === null || _b === void 0 ? void 0 : _b.groupImage;
    try {
        const group = yield Chat_1.default.findById(groupId);
        if (!(group === null || group === void 0 ? void 0 : group.isGroupChat)) {
            return res.status(400).json({
                success: false,
                error: "Please try this on a valid group"
            });
        }
        if (group.groupAdmin.toString() !== userId) {
            return res.status(401).json({
                success: false,
                error: "Access Denied!!"
            });
        }
        if (!groupImage) {
            return res.status(400).json({
                success: false,
                error: "Please provide us with an image to update with"
            });
        }
        const oldImage = group.groupImage;
        const cloudinary = (0, cloudinary_1.getCloudinary)();
        const newGroupImageUrl = yield cloudinary.uploader.upload(groupImage === null || groupImage === void 0 ? void 0 : groupImage.tempFilePath, {
            folder: "chit-chats/group-image"
        });
        const updatedGroupData = {
            groupImage: newGroupImageUrl.url
        };
        const updateGroup = yield Chat_1.default.findByIdAndUpdate(groupId, { $set: updatedGroupData }, { new: true });
        fs_1.default.unlink(groupImage.tempFilePath, err => console.log(err));
        if (oldImage && oldImage.includes("https://thumbs.dreamstime.com")) {
            return res.status(200).json({
                success: true,
                data: {
                    image: updateGroup === null || updateGroup === void 0 ? void 0 : updateGroup.groupImage
                }
            });
        }
        const deletionTarget = "chit-chats/group-image/" + (oldImage === null || oldImage === void 0 ? void 0 : oldImage.split("/")[oldImage.split("/").length - 1].split(".")[0]);
        yield cloudinary.uploader.destroy(deletionTarget);
        res.status(200).json({
            success: true,
            data: {
                image: updateGroup === null || updateGroup === void 0 ? void 0 : updateGroup.groupImage
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error!!"
        });
    }
});
exports.updateGroupImage = updateGroupImage;
const leaveGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: errors.array().length > 1 ? errors.array()[1].msg : errors.array()[0].msg
        });
    }
    const { groupId } = req.body;
    try {
        const group = yield Chat_1.default.findById(groupId);
        if (!(group === null || group === void 0 ? void 0 : group.isGroupChat)) {
            return res.status(400).json({
                success: false,
                error: "Please try this on a valid group"
            });
        }
        if (!(0, helpers_1.isUserInGroup)(group.users, userId)) {
            return res.status(401).json({
                success: false,
                error: "Bro... join the group first... man..."
            });
        }
        if (group.groupAdmin.toString() === userId) {
            return res.status(200).json({
                success: false,
                error: "An admin cannot leave the group... please make another person admin first..."
            });
        }
        const newUserList = group.users.filter((user) => user.toString() !== userId);
        const updatedGroupData = {
            users: newUserList
        };
        yield Chat_1.default.findByIdAndUpdate(groupId, { $set: updatedGroupData }, { new: true });
        res.status(200).json({
            success: true
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
});
exports.leaveGroup = leaveGroup;
const removeUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: errors.array().length > 1 ? errors.array()[1].msg : errors.array()[0].msg
        });
    }
    const { groupId, targetUserId } = req.body;
    try {
        const group = yield Chat_1.default.findById(groupId);
        if (!(group === null || group === void 0 ? void 0 : group.isGroupChat)) {
            return res.status(400).json({
                success: false,
                error: "Please apply this things on a group"
            });
        }
        if (group.groupAdmin.toString() !== userId) {
            return res.status(401).json({
                success: false,
                error: "Bro first become an admin"
            });
        }
        if (group.groupAdmin.toString() === targetUserId) {
            return res.status(400).json({
                success: false,
                error: "An admin cannot leave the group"
            });
        }
        if (!(0, helpers_1.isUserInGroup)(group.users, targetUserId)) {
            return res.status(400).json({
                success: false,
                error: "No such user exist in the group"
            });
        }
        const newUpdatedGroup = {
            users: group.users.filter((user) => user.toString() !== targetUserId)
        };
        yield Chat_1.default.findByIdAndUpdate(groupId, { $set: newUpdatedGroup }, { new: true });
        res.status(200).json({
            success: true
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error!!"
        });
    }
});
exports.removeUser = removeUser;
const addUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: errors.array().length > 1 ? errors.array()[1].msg : errors.array()[0].msg
        });
    }
    const { groupId, targetUsers } = req.body;
    try {
        const group = yield Chat_1.default.findById(groupId);
        if (!(group === null || group === void 0 ? void 0 : group.isGroupChat)) {
            return res.status(400).json({
                success: false,
                error: "Please try on valid group"
            });
        }
        if (group.groupAdmin.toString() !== userId) {
            return res.status(401).json({
                success: false,
                error: "Bro... please become an admin first..."
            });
        }
        if ((0, helpers_1.checkIfUsersInGroup)(group.users, targetUsers)) {
            return res.status(400).json({
                success: false,
                error: "Some users already exist in the group"
            });
        }
        const updatedGroupData = {
            users: [...group.users, ...targetUsers]
        };
        yield Chat_1.default.findByIdAndUpdate(groupId, { $set: updatedGroupData }, { new: true });
        res.status(200).json({
            success: true
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error!!"
        });
    }
});
exports.addUsers = addUsers;
