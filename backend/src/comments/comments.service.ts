import { Injectable } from '@nestjs/common';
import { CommentRepository } from './comments.repository';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentRepository) {}

  async createComment(
    createCommentDto: Partial<Comment>,
    postId: string,
  ): Promise<Comment> {
    return this.commentsRepository.createComment(createCommentDto, postId);
  }

  async findAll(): Promise<Comment[]> {
    return this.commentsRepository.findAll();
  }

  async findById(id: string): Promise<Comment | null> {
    return this.commentsRepository.findById(id);
  }

  async updateComment(
    id: string,
    updateCommentDto: Partial<Comment>,
  ): Promise<Comment | null> {
    return this.commentsRepository.updateComment(id, updateCommentDto);
  }

  async deleteComment(id: string): Promise<Comment | null> {
    return this.commentsRepository.deleteComment(id);
  }
}
