import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MessagesService } from './messages.service';

@WebSocketGateway({ cors: true })
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessagesService) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    client: Socket,
    payload: {
      sender: string;
      receiver: string;
      message: string;
      room: string;
    },
  ) {
    const savedMessage = await this.messageService.saveMessage(payload);
    this.server.to(payload.room).emit('receiveMessage', savedMessage);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, room: string) {
    if (!client.rooms.has(room)) {
      client.join(room);
      const messages = await this.messageService.getMessagesForRoom(room);

      this.server.to(room).emit('receiveMessage', messages);
    } else {
      console.log(`Client ${client.id} is already in room: ${room}`);
    }
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
  }
}
