import { Router } from 'express';
import * as logout_controller from '../controllers/logoutController';
export const logoutRouter: Router = Router();

logoutRouter.get('/', logout_controller.logout);
