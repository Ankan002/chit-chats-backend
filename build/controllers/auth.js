"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config();
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: errors.array()
        });
    }
    const { name, email, username, providerId, image } = req.body;
    try {
        const existingUser = yield User_1.default.findOne({
            providerId
        });
        if (existingUser) {
            const data = {
                user: existingUser._id
            };
            const token = jsonwebtoken_1.default.sign(data, (_a = process.env.SECRET) !== null && _a !== void 0 ? _a : '');
            return res.status(200).set({
                'authToken': token
            }).json({
                success: true
            });
        }
        const user = yield User_1.default.create({
            name,
            username,
            email,
            providerId,
            image
        });
        const data = {
            user: user._id
        };
        const token = jsonwebtoken_1.default.sign(data, (_b = process.env.SECRET) !== null && _b !== void 0 ? _b : '');
        res.status(200).set({
            'authToken': token
        }).json({
            success: true
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error!!'
        });
    }
    ;
});
exports.login = login;
