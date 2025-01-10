import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './entities/comment.entity';
import { Model } from 'mongoose';
import { Goal, GoalDocument } from 'src/goals/entities/goal.entity';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(Goal.name)
    private readonly goalModel: Model<GoalDocument>,
  ) {}

  async createComment(
    comment: Partial<Comment>,
    postId: string,
  ): Promise<Comment> {
    const newComment = new this.commentModel(comment);
    const post = await this.goalModel.findById(postId);

    post.commentsIds.push(newComment._id.toString());

    await post.save();

    return newComment.save();
  }

  async findAll(): Promise<Comment[]> {
    return this.commentModel.find().exec();
  }

  async findById(id: string): Promise<Comment | null> {
    return this.commentModel.findOne({ id }).exec();
  }

  async updateComment(
    id: string,
    updateData: Partial<Comment>,
  ): Promise<Comment | null> {
    return this.commentModel
      .findOneAndUpdate({ id }, updateData, { new: true })
      .exec();
  }

  async deleteComment(id: string): Promise<Comment | null> {
    return this.commentModel.findOneAndDelete({ id }).exec();
  }
}
