import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectToDB = () => {
    mongoose.connect(process.env.DB_URI ?? '')
    .then(() => console.log('Connected to DB'))
    .catch((error) => {
        console.log(error)
    });
}