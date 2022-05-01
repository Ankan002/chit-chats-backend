"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunServer = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const connectToDB_1 = require("./config/connectToDB");
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
dotenv_1.default.config();
const RunServer = () => {
    var _a;
    const app = (0, express_1.default)();
    const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : '';
    (0, connectToDB_1.connectToDB)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use((0, express_fileupload_1.default)({
        useTempFiles: true
    }));
    app.get('/', (req, res) => {
        res.status(200).json({
            message: 'Welcome to ChitChats API!!'
        });
    });
    app.use('/api', auth_1.default);
    app.use('/api', user_1.default);
    app.listen(PORT, () => console.log(`App is running at port: ${PORT}`));
};
exports.RunServer = RunServer;
