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
    postId: number;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Goal', required: true})
    goal: Goal;
}

export const GoalUpdateSchema = SchemaFactory.createForClass(GoalUpdate);