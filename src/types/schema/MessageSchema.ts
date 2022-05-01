import type {ObjectId} from 'mongoose';

export interface MessageSchema{
    sender: ObjectId;
    content?: String;
    chat: ObjectId;
    media?: String;
    replyingTo?: ObjectId;
}