import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema()
export class Payment extends Document {
  @Prop({ required: true })
  paymentNumber: string;

  @Prop({ required: true })
  paymentMethod: string;

  @Prop({ required: true })
  paymentStatus: string;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ required: true, type: String })
  profileId: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
