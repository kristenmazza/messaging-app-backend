import express, { Router } from 'express';
import * as user_controller from '../controllers/userController';

export const userRouter: Router = Router();

userRouter.get('/:userId', user_controller.user_detail);

userRouter.put('/:userId', user_controller.user_update);
