import express from 'express';
import type {Router} from 'express';
import {fetchUser} from '../middlewares/fetchUser';
import {getUser} from '../controllers/user';

const router: Router = express.Router();


router.get('/user', fetchUser, getUser);


export default router;