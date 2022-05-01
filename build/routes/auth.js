"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.post("/auth/login", [
    (0, express_validator_1.body)("name")
        .isString()
        .trim()
        .isLength({ min: 1 })
        .withMessage("Name should be at least one character long..."),
    (0, express_validator_1.body)("username")
        .isString()
        .trim()
        .isLength({ min: 3, max: 40 })
        .withMessage("Name should be at least three and at most 40 characters long..."),
    (0, express_validator_1.body)("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email id..."),
    (0, express_validator_1.body)("providerId")
        .trim()
        .isString()
        .isLength({ min: 1 })
        .withMessage("ProviderId is required..."),
    (0, express_validator_1.body)("image")
        .trim()
        .isString()
        .isLength({ min: 1 })
        .withMessage("Please provide us with a valid image"),
], auth_1.login);
exports.default = router;
