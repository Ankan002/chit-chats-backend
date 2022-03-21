import type {Request, Response} from 'express';

export const getUser = (req: Request, res: Response) => {
    const result = req.user;
}