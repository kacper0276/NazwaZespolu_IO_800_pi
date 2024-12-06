import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GoalDocument = Goal & Document;

@Schema()
export class Goal extends Document {}
