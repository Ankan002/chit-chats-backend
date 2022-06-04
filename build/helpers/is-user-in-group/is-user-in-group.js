"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserInGroup = void 0;
const isUserInGroup = (users, userId) => {
    let startingPoint = 0;
    let endingPoint = users.length - 1;
    while (startingPoint <= endingPoint) {
        if (users[startingPoint].toString() === userId)
            return true;
        if (startingPoint === endingPoint) {
            startingPoint++;
            endingPoint--;
            continue;
        }
        if (users[endingPoint].toString() === userId)
            return true;
        startingPoint++;
        endingPoint--;
    }
    return false;
};
exports.isUserInGroup = isUserInGroup;
