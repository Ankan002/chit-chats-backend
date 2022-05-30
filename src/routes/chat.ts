import express from "express";
import { fetchUser } from "../middlewares/fetchUser";
import {
  accessChats,
  getAllChats,
  createGroup,
  updateGroupName,
  updateGroupImage,
  leaveGroup,
  removeUser,
  addUsers
} from "../controllers/chat";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/chat",
  [
    body("user")
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide us with a user to chat with"),
  ],
  fetchUser,
  accessChats
);

router.get("/chat", fetchUser, getAllChats);

router.post(
  "/chat/group",
  [
    body("chatName")
      .isString()
      .isLength({ min: 3, max: 30 })
      .withMessage(
        "The group name should be at least 3 and at most 30 characters long"
      ),
    body("users")
      .isArray({ min: 2, max: 49 })
      .withMessage(
        "At least 3 members are required to form the group and at most 50 members are allowed"
      ),
  ],
  fetchUser,
  createGroup
);

router.put(
  "/chat/group/rename",
  [
    body("chatName")
      .isString()
      .isLength({ min: 3, max: 30 })
      .withMessage(
        "The group name should be at least 3 and at most 30 characters long"
      ),
    body("groupId")
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide us with a group id to rename"),
  ],
  fetchUser,
  updateGroupName
);

router.put(
  "/chat/group/update-image",
  [
    body("groupId")
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide us with a group id to rename"),
  ],
  fetchUser,
  updateGroupImage
);

router.put(
  "/chat/group/leave-group",
  [
    body("groupId")
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide us with a group id to rename"),
  ],
  fetchUser,
  leaveGroup
);

router.put(
  "/chat/group/remove-user",
  [
    body("groupId")
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide us with a group id"),
    body("targetUserId")
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide us with a group id to rename"),
  ],
  fetchUser,
  removeUser
);

router.put("/chat/group/add-users", [
  body("groupId")
    .isString()
    .isLength({ min: 1 })
    .withMessage("Please provide us with a group id"),
  body("targetUsers")
    .isArray({ min: 1 })
    .withMessage("Provide us with at least one user"),
], fetchUser, addUsers);

export default router;
