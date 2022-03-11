import express from 'express';
import dotenv from 'dotenv';
import type {Express, Request, Response} from 'express';

dotenv.config();

export const RunServer = () => {
    const app: Express = express();
    const PORT: string = process.env.PORT ?? '';

    app.get('/', (req: Request, res: Response) => {
        res.status(200).json({
            message: 'Welcome to ChitChats API!!'
        });
    });

    app.listen(PORT, () => console.log(`App is running at port: ${PORT}`));
}