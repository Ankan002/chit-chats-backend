"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const isGroupMember_1 = require("../middlewares/isGroupMember");
const fetchUser_1 = require("../middlewares/fetchUser");
const express_validator_1 = require("express-validator");
const message_1 = require("../controllers/message");
const router = express_1.default.Router();
router.post("/message", [
    (0, express_validator_1.body)("chatId").isString().isLength({ min: 1 }).withMessage("Please provide us with a valid message Id"),
    (0, express_validator_1.body)("content").isString().trim().isLength({ min: 5, max: 400 }).withMessage("Message Content should be at least 5 characters long and at most 400 characters long")
], fetchUser_1.fetchUser, isGroupMember_1.isGroupMember, message_1.sendMessage);
router.post("/message/media", fetchUser_1.fetchUser, isGroupMember_1.isGroupMember, message_1.sendMediaMessage);
router.get("/message/:chatId", fetchUser_1.fetchUser, isGroupMember_1.isGroupMemberByParams, message_1.getMessages);
exports.default = router;
