import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
