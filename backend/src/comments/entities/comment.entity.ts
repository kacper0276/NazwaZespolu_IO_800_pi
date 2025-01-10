import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema()
export class Comment extends Document {
    _id: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    value: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);