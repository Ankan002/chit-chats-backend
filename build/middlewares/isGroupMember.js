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
exports.isGroupMemberByParams = exports.isGroupMember = void 0;
const Chat_1 = __importDefault(require("../models/Chat"));
const isGroupMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.user;
    const { chatId } = req.body;
    try {
        const fetchedChat = yield Chat_1.default.findById(chatId);
        if (!chatId) {
            return res.status(400).json({
                success: false,
                error: "Please provide us with a valid groupId"
            });
        }
        let isUserFound = false;
        for (let user of (_a = fetchedChat === null || fetchedChat === void 0 ? void 0 : fetchedChat.users) !== null && _a !== void 0 ? _a : []) {
            if (user.toString() === userId) {
                isUserFound = true;
                break;
            }
        }
        if (!isUserFound) {
            return res.status(401).json({
                success: false,
                error: "You are not a part of this group"
            });
        }
        next();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
});
exports.isGroupMember = isGroupMember;
const isGroupMemberByParams = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userId = req.user;
    const { chatId } = req.params;
    try {
        const fetchedChat = yield Chat_1.default.findById(chatId);
        if (!chatId) {
            return res.status(400).json({
                success: false,
                error: "Please provide us with a valid groupId"
            });
        }
        let isUserFound = false;
        for (let user of (_b = fetchedChat === null || fetchedChat === void 0 ? void 0 : fetchedChat.users) !== null && _b !== void 0 ? _b : []) {
            if (user.toString() === userId) {
                isUserFound = true;
                break;
            }
        }
        if (!isUserFound) {
            return res.status(401).json({
                success: false,
                error: "You are not a part of this group"
            });
        }
        next();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
});
exports.isGroupMemberByParams = isGroupMemberByParams;
