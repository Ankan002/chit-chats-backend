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
exports.fetchUser = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const fetchUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access Denied!!'
        });
    }
    try {
        const data = jsonwebtoken_1.default.verify(token, (_a = process.env.SECRET) !== null && _a !== void 0 ? _a : '');
        req.user = data.user;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error!!'
        });
    }
});
exports.fetchUser = fetchUser;
