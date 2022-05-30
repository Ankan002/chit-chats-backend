import mongoose from 'mongoose';
import type { Schema } from 'mongoose';
import type { ChatSchema } from '../types/schema/ChatSchema';

const chatSchema: Schema = new mongoose.Schema<ChatSchema>({
    chatName: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 30,
        required: true
    },
    isGroupChat: {
        type: Boolean,
        default: false,
        required: true
    },
    users: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: true
    },
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    groupImage: {
        type: String,
        required: false,
    }
}, {timestamps: true});

const Chat = mongoose.model<ChatSchema>('Chat', chatSchema);

export default Chat;