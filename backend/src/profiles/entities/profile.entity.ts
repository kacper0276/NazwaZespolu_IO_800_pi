import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/users/entities/user.entity';

export type ProfileDocument = Profile & Document;

@Schema()
export class Profile extends Document {
  @Prop({ type: [String], default: [] })
  currentGoals: string[];

  @Prop({ type: [String], default: [] })
  completedGoals: string[];

  @Prop({ type: [Number], default: [] })
  followers: number[];

  @Prop({ type: [Number], default: [] })
  following: number[];

  @Prop({ default: false })
  premium: boolean;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
