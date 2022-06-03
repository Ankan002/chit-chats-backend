import express from 'express';
import dotenv from 'dotenv';
import {connectToDB} from './config/connectToDB';
import cors from 'cors';
import fileUpload from 'express-fileupload';

import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import chatRoutes from './routes/chat';
import messageRoutes from './routes/message';

import type {Express, Request, Response} from 'express';

dotenv.config();

export const RunServer = () => {
    const app: Express = express();
    const PORT: string = process.env.PORT ?? '';

    connectToDB();

    app.use(cors());
    app.use(express.json());
    app.use(fileUpload({
        useTempFiles: true
    }));

    app.get('/', (req: Request, res: Response) => {
        res.status(200).json({
            message: 'Welcome to ChitChats API!!'
        });
    });

    app.use('/api', authRoutes);
    app.use('/api', userRoutes);
    app.use('/api', chatRoutes);
    app.use('/api', messageRoutes);

    app.listen(PORT, () => console.log(`App is running at port: ${PORT}`));
}