import { Router } from 'express';
import * as auth_controller from '../controllers/authController';
export const authRouter: Router = Router();

authRouter.post('/', auth_controller.login_user);
