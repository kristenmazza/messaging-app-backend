import TypingController from './controllers/TypingController';
import RoomController from './controllers/RoomController';
import MessageController from './controllers/MessageController'

const sockets = (socket: any) => {
  const typingController = new TypingController(socket);
  const roomController = new RoomController(socket);
  const messageController = new MessageController(socket)

  socket.on('send-message', messageController.sendMessage);

  socket.on('typing-started', typingController.typingStarted);

  socket.on('typing-stopped', typingController.typingStopped);

  socket.on('join-room', roomController.joinRoom);

  socket.on('disconnect', (socket: any) => {
    console.log('user left');
  });
};

export default sockets;
