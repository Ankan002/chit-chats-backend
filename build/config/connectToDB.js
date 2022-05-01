"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectToDB = () => {
    var _a;
    mongoose_1.default.connect((_a = process.env.DB_URI) !== null && _a !== void 0 ? _a : '')
        .then(() => console.log('Connected to DB'))
        .catch((error) => {
        console.log(error);
    });
};
exports.connectToDB = connectToDB;
