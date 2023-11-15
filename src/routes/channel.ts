import { Router } from 'express';
import * as channel_controller from '../controllers/channelController';
import * as message_controller from '../controllers/messageController';

export const channelRouter: Router = Router();

channelRouter.post('/', channel_controller.channel_create);

channelRouter.get('/', channel_controller.channel_list);

// channelRouter.get('/:channelId/', channel_controller.channel_detail);
channelRouter.get('/channel', channel_controller.channel_detail);

channelRouter.get(
  '/:channelId/messages/:messageId',
  message_controller.message_detail
);

channelRouter.post('/:channelId/messages/', message_controller.message_create);

channelRouter.get('/:channelId/messages/', message_controller.message_list);
