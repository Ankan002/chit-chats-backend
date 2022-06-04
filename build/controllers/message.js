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
exports.getMessages = exports.sendMediaMessage = exports.sendMessage = void 0;
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const Chat_1 = __importDefault(require("../models/Chat"));
const Message_1 = __importDefault(require("../models/Message"));
const cloudinary_1 = require("../config/cloudinary");
const fs_1 = __importDefault(require("fs"));
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: (errors.array().length > 1) ? errors.array()[1].msg : errors.array()[0].msg
        });
    }
    try {
        const { chatId, content } = req.body;
        let newMessage = yield Message_1.default.create({
            sender: userId,
            content,
            chat: chatId
        });
        newMessage = yield newMessage.populate("sender", "username image name _id");
        newMessage = yield newMessage.populate("chat");
        let message = yield User_1.default.populate(newMessage, {
            path: "chat.users",
            select: "_id __v createdAt updatedAt name email image username tagline"
        });
        message = yield User_1.default.populate(newMessage, {
            path: "chat.groupAdmin",
            select: "_id __v createdAt updatedAt name email image username tagline"
        });
        yield Chat_1.default.findByIdAndUpdate(chatId, { $set: { latestMessage: message._id } }, { new: true });
        res.status(200).json({
            success: true,
            data: {
                message
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
exports.sendMessage = sendMessage;
const sendMediaMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.user;
    const media = (_a = req.files) === null || _a === void 0 ? void 0 : _a.media;
    const { content, chatId } = req.body;
    if (!media) {
        return res.status(400).json({
            success: false,
            error: "No media file found, try sending plain message via another route"
        });
    }
    if (content.length < 5 || content.length > 400) {
        return res.status(400).json({
            success: false,
            error: "Message Content should be at least 5 characters long and at most 400 characters long"
        });
    }
    const cloudinary = (0, cloudinary_1.getCloudinary)();
    try {
        const image = yield cloudinary.uploader.upload(media === null || media === void 0 ? void 0 : media.tempFilePath, {
            folder: "chit-chats/chat-media"
        });
        let newMessage = yield Message_1.default.create({
            chat: chatId,
            content,
            media: image.url,
            sender: userId
        });
        newMessage = yield newMessage.populate("sender", "username image name _id");
        newMessage = yield newMessage.populate("chat");
        let message = yield User_1.default.populate(newMessage, {
            path: "chat.users",
            select: "__v _id username name image tagline email createdAt updatedAt"
        });
        message = yield User_1.default.populate(newMessage, {
            path: "chat.groupAdmin",
            select: "__v _id name username email image tagline updatedAt createdAt"
        });
        yield Chat_1.default.findByIdAndUpdate(chatId, { $set: { latestMessage: message._id } }, { new: true });
        fs_1.default.unlink(media.tempFilePath, err => console.log(err));
        res.status(200).json({
            success: true,
            data: {
                message
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
exports.sendMediaMessage = sendMediaMessage;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e;
    const chatId = req.params.chatId;
    const pageNumber = parseInt((_c = ((_b = req.query.page) === null || _b === void 0 ? void 0 : _b.toString())) !== null && _c !== void 0 ? _c : "1");
    const numberOfMessages = parseInt((_e = ((_d = req.query.messages) === null || _d === void 0 ? void 0 : _d.toString())) !== null && _e !== void 0 ? _e : "15");
    //TODO: If required populate it with chatsId `.populate("chat")`
    try {
        let chats = yield Message_1.default.find({ chat: chatId }).sort("-createdAt").limit(numberOfMessages).skip(numberOfMessages * (pageNumber - 1)).populate("sender", "username name image _id");
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
            error: "Internal Server Error!!"
        });
    }
});
exports.getMessages = getMessages;
