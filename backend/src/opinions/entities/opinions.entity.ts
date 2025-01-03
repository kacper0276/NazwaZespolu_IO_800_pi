import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { userData } from 'src/users/dto/user.dto';

export type OpinionDocument = Opinion & Document;

@Schema()
export class Opinion extends Document {
  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  opinion: string;

  @Prop({ type: Object })
  user: userData;
}

export const OpinionSchema = SchemaFactory.createForClass(Opinion);
