import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../enums/role.enum';

export type UserDocument = User & Document;

@Schema()
export class User extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: Role, default: Role.USER })
  role: Role;

  @Prop({ type: Boolean, default: false })
  isActivated: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
