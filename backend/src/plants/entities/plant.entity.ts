import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GoalType } from 'src/enums/goaltype.enum';
import { GrowthStatus } from 'src/enums/growthstatus.enum';

export type PlantDocument = Plant & Document;

@Schema()
export class Plant extends Document {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  plantType: string;

  @Prop({ required: true })
  plantName: string;

  @Prop({ type: String, enum: GrowthStatus, required: true })
  growthStatus: GrowthStatus;
  
  @Prop({ type: String, enum: GoalType, required: true })
  goalType: GoalType;
}

export const PlantSchema = SchemaFactory.createForClass(Plant);