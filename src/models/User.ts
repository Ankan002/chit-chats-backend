import mongoose from 'mongoose';
import { Schema } from 'mongoose'
import { UserSchema } from '../@types/UserSchema';


const userSchema: Schema = new mongoose.Schema<UserSchema>({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 25,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    providerId: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
        default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
    },
    notificationToken: {
        type: [String],
        default: []
    },
    pinnedChats: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Chat',
        default: [],
    }
}, { timestamps: true });

const User = mongoose.model<UserSchema>('User', userSchema);

export default User;

