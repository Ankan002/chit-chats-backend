"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema = new mongoose_1.default.Schema({
    chatName: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 30,
        required: true
    },
    isGroupChat: {
        type: Boolean,
        default: false,
        required: true
    },
    users: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: 'User',
        required: true
    },
    latestMessage: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Message'
    },
    groupAdmin: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    groupImage: {
        type: String,
        required: false,
    }
}, { timestamps: true });
const Chat = mongoose_1.default.model('Chat', chatSchema);
exports.default = Chat;
