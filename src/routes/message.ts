import express from "express";
import { isGroupMember, isGroupMemberByParams } from "../middlewares/isGroupMember";
import { fetchUser } from "../middlewares/fetchUser";
import { body } from "express-validator";
import { sendMessage, getMessages, sendMediaMessage } from "../controllers/message";

const router = express.Router();

router.post("/message", [
    body("chatId").isString().isLength({min: 1}).withMessage("Please provide us with a valid message Id"),
    body("content").isString().trim().isLength({min: 5, max: 400}).withMessage("Message Content should be at least 5 characters long and at most 400 characters long")
], fetchUser, isGroupMember, sendMessage);

router.post("/message/media", fetchUser, isGroupMember, sendMediaMessage);

router.get("/message/:chatId", fetchUser, isGroupMemberByParams, getMessages)

export default router;