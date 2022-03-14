import type {ObjectId} from 'mongoose';

export interface ChatSchema{
    chatName: String;
    isGroupChat: Boolean;
    users: Array<ObjectId>;
    latestMessage?: ObjectId;
    groupAdmin: ObjectId;
    groupImage?: String;
}