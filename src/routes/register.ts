import { Router } from 'express';
import * as register_controller from '../controllers/registerController';
export const registerRouter: Router = Router();

registerRouter.post('/', register_controller.register_user);
