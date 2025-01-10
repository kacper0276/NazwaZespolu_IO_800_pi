import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Role } from '../../enums/role.enum';
import { Profile } from '../../profiles/entities/profile.entity';

export type UserDocument = User & Document;

@Schema()
export class User extends Document {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop()
  firstname: string;

  @Prop()
  lastname: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: Role, default: Role.USER })
  role: Role;

  @Prop({ type: Boolean, default: false })
  isActivated: boolean;

  @Prop()
  profileImage: string;

  @Prop()
  backgroundImage: string;

  @Prop({ default: '' })
  profileId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Profile' })
  profile: Profile;
}

export const UserSchema = SchemaFactory.createForClass(User);
