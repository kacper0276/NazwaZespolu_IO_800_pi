import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';

@ApiBearerAuth('access-token')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':postId')
  async createComment(
    @Body() createCommentDto: Partial<Comment>,
    @Param('postId') postId: string,
    @Res() response: Response,
  ) {
    try {
      const comment = await this.commentsService.createComment(
        createCommentDto,
        postId,
      );

      response.status(HttpStatus.OK).send({
        message: 'create-comment',
        data: comment,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(@Res() response: Response) {
    const comments = await this.commentsService.findAll();

    response.status(HttpStatus.OK).send({
      message: 'all-comments',
      data: comments,
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Res() response: Response) {
    const comment = await this.commentsService.findAll();
    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }

    response.status(HttpStatus.OK).send({
      message: 'comment-data',
      data: comment,
    });
  }

  @Put(':id')
  async updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: Partial<Comment>,
    @Res() response: Response,
  ) {
    try {
      const updatedComment = await this.commentsService.updateComment(
        id,
        updateCommentDto,
      );
      if (!updatedComment) {
        throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
      }

      response.status(HttpStatus.OK).send({
        message: 'update-comment',
        data: updatedComment,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async deleteComment(@Param('id') id: string, @Res() response: Response) {
    const deletedComment = await this.commentsService.deleteComment(id);
    if (!deletedComment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }

    response.status(HttpStatus.OK).send({
      message: 'remove-comment',
      data: deletedComment,
    });
  }
}
