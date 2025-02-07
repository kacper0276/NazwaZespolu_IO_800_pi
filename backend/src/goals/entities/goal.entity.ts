import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Comment } from 'src/comments/entities/comment.entity';
import { Profile } from 'src/profiles/entities/profile.entity';
import { Update } from '../types/update.type';

export type GoalDocument = Goal & Document;

@Schema()
export class Goal extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({ default: false })
  dailyReminder: boolean;

  @Prop()
  image: string;

  @Prop()
  visibility: string;

  @Prop({ default: false })
  allowComments: boolean;

  @Prop()
  difficulty: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  treeSkin: string;

  @Prop({ type: Boolean, default: false })
  isDone: boolean;

  @Prop({ type: Boolean, default: false })
  isPost: boolean;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: 0 })
  reactions: number;

  @Prop({ type: [String], default: [] })
  commentsIds: string[];

  @Prop({ type: [Comment], ref: 'Comment' })
  comments: Comment[];

  @Prop({ type: [Object], default: [] })
  updates: Update[];

  @Prop({ default: '' })
  profileId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Profile' })
  profile: Profile;
}

export const GoalSchema = SchemaFactory.createForClass(Goal);
