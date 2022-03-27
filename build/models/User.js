"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 40,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    providerId: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
        default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
    },
    notificationToken: {
        type: [String],
        default: []
    },
    pinnedChats: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: 'Chat',
        default: [],
    }
}, { timestamps: true });
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
