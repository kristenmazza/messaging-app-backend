import { Router } from 'express';
import * as refresh_token_controller from '../controllers/refreshTokenController';
export const refreshTokenRouter: Router = Router();

refreshTokenRouter.get('/', refresh_token_controller.handle_refresh_token);
