import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type OpinionDocument = Opinion & Document;

@Schema()
export class Opinion extends Document {
  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  opinion: string;
}

export const OpinionSchema = SchemaFactory.createForClass(Opinion);
