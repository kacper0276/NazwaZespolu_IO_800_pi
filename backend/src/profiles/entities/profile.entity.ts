import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity';

export type ProfileDocument = Profile & Document;

@Schema()
export class Profile extends Document {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: [String], default: [] })
  currentGoals: string[];

  @Prop({ type: [String], default: [] })
  completedGoals: string[];

  @Prop({ type: [String], default: [] })
  followers: string[];

  @Prop({ type: [String], default: [] })
  following: string[];

  @Prop({ default: false })
  premium: boolean;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
