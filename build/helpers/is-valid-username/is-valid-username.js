"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidUsername = void 0;
const isValidUsername = (username) => {
    if (username.length < 3)
        return false;
    if (username.length >= 4 && username.substring(username.length - 4) === "_gal")
        return false;
    return true;
};
exports.isValidUsername = isValidUsername;
