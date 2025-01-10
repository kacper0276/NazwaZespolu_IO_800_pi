import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './entities/comment.entity';
import { Model } from 'mongoose';

@Injectable()
export class CommentRepository {
    constructor(
        @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
    ) {}
    
    async createComment(comment: Partial<Comment>): Promise<Comment> {
        const newComment = new this.commentModel(comment);
        return newComment.save();
    }
    
    async findAll(): Promise<Comment[]> {
        return this.commentModel.find().exec();
    }
    
    async findById(id: string): Promise<Comment | null> {
        return this.commentModel.findOne({ id }).exec();
    }
    
    async updateComment(id: string, updateData: Partial<Comment>): Promise<Comment | null> {
        return this.commentModel.findOneAndUpdate({ id }, updateData, { new: true }).exec();
    }
    
    async deleteComment(id: string): Promise<Comment | null> {
        return this.commentModel.findOneAndDelete({ id }).exec();
    }
}



