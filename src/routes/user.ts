import express from "express";
import type { Router } from "express";
import { fetchUser } from "../middlewares/fetchUser";
import {
  getUser,
  updateUsername,
  updateTagline,
  updateProfilePicture,
  searchUser,
} from "../controllers/user";
import { body } from "express-validator";

const router: Router = express.Router();

router.get("/user/search", fetchUser, searchUser);

router.get("/user", fetchUser, getUser);

router.put(
  "/user/username",
  fetchUser,
  [
    body("username")
      .trim()
      .isLength({ min: 3, max: 40 })
      .withMessage(
        "Name should be at least three and at most 40 characters long..."
      ),
  ],
  updateUsername
);

router.put(
  "/user/tagline",
  fetchUser,
  [
    body("tagline")
      .trim()
      .isLength({ min: 20, max: 350 })
      .withMessage(
        "Name should be at least 20 and at most 350 characters long..."
      ),
  ],
  updateTagline
);

router.put("/user/profile-picture", fetchUser, updateProfilePicture);

export default router;
