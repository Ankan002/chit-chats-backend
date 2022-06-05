"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fetchUser_1 = require("../middlewares/fetchUser");
const chat_1 = require("../controllers/chat");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.post("/chat", [
    (0, express_validator_1.body)("user")
        .isString()
        .isLength({ min: 1 })
        .withMessage("Please provide us with a user to chat with"),
], fetchUser_1.fetchUser, chat_1.accessChats);
router.get("/chat", fetchUser_1.fetchUser, chat_1.getAllChats);
router.post("/chat/group", [
    (0, express_validator_1.body)("chatName")
        .isString()
        .isLength({ min: 3, max: 30 })
        .withMessage("The group name should be at least 3 and at most 30 characters long"),
    (0, express_validator_1.body)("users")
        .isArray({ min: 2, max: 49 })
        .withMessage("At least 3 members are required to form the group and at most 50 members are allowed"),
], fetchUser_1.fetchUser, chat_1.createGroup);
router.put("/chat/group/rename", [
    (0, express_validator_1.body)("chatName")
        .isString()
        .isLength({ min: 3, max: 30 })
        .withMessage("The group name should be at least 3 and at most 30 characters long"),
    (0, express_validator_1.body)("groupId")
        .isString()
        .isLength({ min: 1 })
        .withMessage("Please provide us with a group id to rename"),
], fetchUser_1.fetchUser, chat_1.updateGroupName);
router.put("/chat/group/update-image", [
    (0, express_validator_1.body)("groupId")
        .isString()
        .isLength({ min: 1 })
        .withMessage("Please provide us with a group id to rename"),
], fetchUser_1.fetchUser, chat_1.updateGroupImage);
router.put("/chat/group/leave-group", [
    (0, express_validator_1.body)("groupId")
        .isString()
        .isLength({ min: 1 })
        .withMessage("Please provide us with a group id to rename"),
], fetchUser_1.fetchUser, chat_1.leaveGroup);
router.put("/chat/group/remove-user", [
    (0, express_validator_1.body)("groupId")
        .isString()
        .isLength({ min: 1 })
        .withMessage("Please provide us with a group id"),
    (0, express_validator_1.body)("targetUserId")
        .isString()
        .isLength({ min: 1 })
        .withMessage("Please provide us with a group id to rename"),
], fetchUser_1.fetchUser, chat_1.removeUser);
router.put("/chat/group/add-users", [
    (0, express_validator_1.body)("groupId")
        .isString()
        .isLength({ min: 1 })
        .withMessage("Please provide us with a group id"),
    (0, express_validator_1.body)("targetUsers")
        .isArray({ min: 1 })
        .withMessage("Provide us with at least one user"),
], fetchUser_1.fetchUser, chat_1.addUsers);
exports.default = router;
