"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLODINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const getCloudinary = () => {
    return cloudinary_1.v2;
};
exports.getCloudinary = getCloudinary;
