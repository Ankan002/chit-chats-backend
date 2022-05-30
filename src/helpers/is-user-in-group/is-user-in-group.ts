import {ObjectId} from "mongoose";

export const isUserInGroup = (users: Array<ObjectId>, userId: string) => {
    let startingPoint = 0;
    let endingPoint = users.length - 1;

    while(startingPoint <= endingPoint){
        if (users[startingPoint].toString() === userId) return true;

        if(startingPoint === endingPoint){
            startingPoint++;
            endingPoint--;
            continue;
        }

        if (users[endingPoint].toString() === userId) return true;

        startingPoint++;
        endingPoint--;
    }

    return false;
}