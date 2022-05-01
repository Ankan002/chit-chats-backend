"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fetchUser_1 = require("../middlewares/fetchUser");
const user_1 = require("../controllers/user");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.get("/user", fetchUser_1.fetchUser, user_1.getUser);
router.put("/user/username", fetchUser_1.fetchUser, [
    (0, express_validator_1.body)("username")
        .trim()
        .isLength({ min: 3, max: 40 })
        .withMessage("Name should be at least three and at most 40 characters long..."),
], user_1.updateUsername);
router.put("/user/tagline", fetchUser_1.fetchUser, [
    (0, express_validator_1.body)("tagline").trim().isLength({ min: 20, max: 350 }).withMessage("Name should be at least 20 and at most 350 characters long...")
], user_1.updateTagline);
router.put("/user/profile-picture", fetchUser_1.fetchUser, user_1.updateProfilePicture);
exports.default = router;
