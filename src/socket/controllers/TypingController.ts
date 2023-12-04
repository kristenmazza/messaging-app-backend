import BaseController from './BaseController';

export default class TypingController extends BaseController {
  typingStarted = (currentChannelId: string) => {
    let skt = this.socket.broadcast;
    skt = currentChannelId ? skt.to(currentChannelId) : skt;
    skt.emit('typing-started-from-server');
  };

  typingStopped = (currentChannelId: string) => {
    let skt = this.socket.broadcast;
    skt = currentChannelId ? skt.to(currentChannelId) : skt;
    skt.emit('typing-stopped-from-server');
  };
}
