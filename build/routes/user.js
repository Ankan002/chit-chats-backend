"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fetchUser_1 = require("../middlewares/fetchUser");
const user_1 = require("../controllers/user");
const router = express_1.default.Router();
router.get('/user', fetchUser_1.fetchUser, user_1.getUser);
exports.default = router;
