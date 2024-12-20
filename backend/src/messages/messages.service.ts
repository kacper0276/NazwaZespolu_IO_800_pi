import { Injectable } from '@nestjs/common';
import { MessageRepository } from './message.repository';

@Injectable()
export class MessagesService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async saveMessage(data: {
    sender: string;
    receiver: string;
    message: string;
    room: string;
  }) {
    return this.messageRepository.createMessage(data);
  }

  async getMessagesForUser(userId: string) {
    return this.messageRepository.findMessagesForUser(userId);
  }

  async getMessagesForRoom(roomId: string) {
    return this.messageRepository.findMessageForRoomId(roomId);
  }
}
