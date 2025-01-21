import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SettingDocument = Setting & Document;

@Schema()
export class Setting extends Document {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: String })
  userId: string;

  @Prop({ type: String })
  type: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  data: any;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
