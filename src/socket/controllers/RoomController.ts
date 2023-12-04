import BaseController from './BaseController';

export default class RoomController extends BaseController {
  joinRoom = (currentChannelId: string) => {
    console.log('joining room');
    this.socket.join(currentChannelId);
  };
}
