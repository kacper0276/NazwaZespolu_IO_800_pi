import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GoalDocument = Goal & Document;

@Schema()
export class Goal extends Document {
  @Prop({ required: true })
  goalId: number;

  @Prop({ required: true })
  goalName: string;

  @Prop({ required: true })
  goalDescription: string;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({ type: Boolean, default: false })
  isDone: boolean;
}

export const GoalSchema = SchemaFactory.createForClass(Goal);