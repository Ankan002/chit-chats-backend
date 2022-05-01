import express from "express";
import { login } from "../controllers/auth";
import { body } from "express-validator";

import type { Router } from "express";

const router: Router = express.Router();

router.post(
  "/auth/login",
  [
    body("name")
      .isString()
      .trim()
      .isLength({ min: 1 })
      .withMessage("Name should be at least one character long..."),
    body("username")
      .isString()
      .trim()
      .isLength({ min: 3, max: 40 })
      .withMessage(
        "Name should be at least three and at most 40 characters long..."
      ),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email id..."),
    body("providerId")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("ProviderId is required..."),
    body("image")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide us with a valid image"),
  ],
  login
);

export default router;
