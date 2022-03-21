import mongoose from 'mongoose';
import type { Schema } from 'mongoose';
import { MessageSchema } from '../types/schema/MessageSchema';

const messageSchema: Schema = new mongoose.Schema<MessageSchema>({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        trim: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    media: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const Message = mongoose.model<MessageSchema>('Message', messageSchema);

export default Message;
