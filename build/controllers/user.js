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
exports.updateProfilePicture = exports.updateTagline = exports.updateUsername = exports.searchUser = exports.getUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const helpers_1 = require("../helpers");
const express_validator_1 = require("express-validator");
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLODINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user;
    try {
        const user = yield User_1.default.findById(userId);
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error!!",
        });
    }
});
exports.getUser = getUser;
const searchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user;
    const keyword = req.query.keyword ? {
        $or: [
            { username: { $regex: req.query.keyword, $options: "i" } },
        ]
    } : {};
    try {
        const users = yield User_1.default.find(keyword).find({ _id: { $ne: userId } }).select("-notificationToken").select("-pinnedChats").select("-providerId");
        res.status(200).json({
            success: true,
            data: {
                users
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
});
exports.searchUser = searchUser;
const updateUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: (errors.array().length > 1) ? (errors.array())[1].msg : (errors.array())[0].msg
        });
    }
    try {
        const { username } = req.body;
        const existingUser = yield User_1.default.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "User with same username exists!!",
            });
        }
        const updatedUser = {};
        if (!(0, helpers_1.isValidUsername)(username)) {
            return res.status(400).json({
                success: false,
                error: "Invalid Username!!",
            });
        }
        if (username)
            updatedUser.username = username;
        const updatedUserWithUsername = yield User_1.default.findByIdAndUpdate(userId, { $set: updatedUser }, { new: true }).select("username");
        res.status(200).json({
            success: true,
            username: updatedUserWithUsername === null || updatedUserWithUsername === void 0 ? void 0 : updatedUserWithUsername.username
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error!!",
        });
    }
});
exports.updateUsername = updateUsername;
const updateTagline = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: (errors.array().length > 1) ? (errors.array())[1].msg : (errors.array())[0].msg
        });
    }
    try {
        const { tagline } = req.body;
        const updatedUserTagline = {};
        if (tagline)
            updatedUserTagline.tagline = tagline;
        const updatedUser = yield User_1.default.findByIdAndUpdate(userId, { $set: updatedUserTagline }, { new: true }).select("tagline");
        res.status(200).json({
            success: true,
            tagline: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.tagline
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
exports.updateTagline = updateTagline;
const updateProfilePicture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.user;
    const image = (_a = req.files) === null || _a === void 0 ? void 0 : _a.image;
    try {
        const cloudinaryUploadResponse = yield cloudinary_1.v2.uploader.upload(image === null || image === void 0 ? void 0 : image.tempFilePath, {
            folder: "chit-chats/profile-image"
        });
        const user = yield User_1.default.findById(userId).select("image");
        const oldImage = user === null || user === void 0 ? void 0 : user.image;
        const updatedData = {
            image: cloudinaryUploadResponse.url
        };
        const newUser = yield User_1.default.findByIdAndUpdate(userId, { $set: updatedData }, { new: true }).select("image");
        fs_1.default.unlink(image.tempFilePath, err => console.log(err));
        if (oldImage === null || oldImage === void 0 ? void 0 : oldImage.includes("lh3.googleusercontent.com")) {
            return res.status(200).json({
                success: true,
                data: {
                    image: newUser === null || newUser === void 0 ? void 0 : newUser.image
                }
            });
        }
        const deletionTarget = "chit-chats/profile-image/" + (oldImage === null || oldImage === void 0 ? void 0 : oldImage.split("/")[oldImage.split("/").length - 1].split(".")[0]);
        yield cloudinary_1.v2.uploader.destroy(deletionTarget);
        res.status(200).json({
            success: true,
            data: {
                image: newUser === null || newUser === void 0 ? void 0 : newUser.image
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
exports.updateProfilePicture = updateProfilePicture;
