import type { ObjectId } from "mongoose";

export const checkIfUsersInGroup = (groupUsers: Array<ObjectId>, targetUsers: Array<string>) => {
    const targetUsersSet = new Set(targetUsers);

    let startingPoint = 0;
    let endingPoint = groupUsers.length - 1;

    while(startingPoint <= endingPoint){
        if(targetUsersSet.has(groupUsers[startingPoint].toString())) return true;

        if(startingPoint === endingPoint){
            startingPoint++;
            endingPoint--;
            continue;
        }

        if(targetUsersSet.has(groupUsers[endingPoint].toString())) return true;

        startingPoint++;
        endingPoint--;
    }

    return false
};