"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunServer = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const RunServer = () => {
    var _a;
    const app = (0, express_1.default)();
    const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : '';
    app.get('/', (req, res) => {
        res.status(200).json({
            message: 'Welcome to ChitChats API!!'
        });
    });
    app.listen(PORT, () => console.log(`App is running at port: ${PORT}`));
};
exports.RunServer = RunServer;
