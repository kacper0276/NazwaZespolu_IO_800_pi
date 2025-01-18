import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Goal } from 'src/goals/entities/goal.entity';

export type GoalUpdateDocument = GoalUpdate & Document;

@Schema()
export class GoalUpdate extends Document {
  @Prop({ default: '' })
  message: string;

  @Prop({ required: false })
  filename: string;

  @Prop({ required: true })
  goalId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Goal', required: false })
  goal: Goal;

  @Prop({ type: Date, required: true })
  createdAt: Date;
}

export const GoalUpdateSchema = SchemaFactory.createForClass(GoalUpdate);
