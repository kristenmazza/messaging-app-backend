import BaseController from './BaseController';

export default class MessageController extends BaseController {
  sendMessage = (message: object, currentChannelId: string) => {
    let skt = this.socket.broadcast;
    skt = currentChannelId ? skt.to(currentChannelId) : skt;
    skt.emit('receive-message', message);
  };
}
