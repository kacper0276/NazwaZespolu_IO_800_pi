import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './entities/message.entity';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async createMessage(data: {
    sender: string;
    receiver: string;
    message: string;
  }) {
    const newMessage = new this.messageModel({
      sender: data.sender,
      receiver: data.receiver,
      message: data.message,
      createdAt: new Date(),
    });
    return newMessage.save();
  }

  async findMessagesForUser(userId: string) {
    return this.messageModel
      .find({ $or: [{ sender: userId }, { receiver: userId }] })
      .sort({ createdAt: 1 });
  }
}
