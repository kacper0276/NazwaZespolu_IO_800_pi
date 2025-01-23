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
  UseInterceptors,
  UploadedFile,
  Res,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import { Goal } from './entities/goal.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { likeAction } from './dto/likeAction.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

const storage = {
  storage: diskStorage({
    destination: '../frontend/public/goalsImg',
    filename: function (req, file, cb) {
      const name = Date.now() + Math.floor(Math.random() * 100) + '.jpg';

      cb(null, name);
    },
  }),
};

@ApiBearerAuth('access-token')
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}
  @Post()
  @UseInterceptors(FileInterceptor('image', storage))
  @UseGuards(JwtAuthGuard)
  async createGoal(
    @Body() createGoalDto: Partial<Goal>,
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response,
  ) {
    try {
      const goal = await this.goalsService.createGoal(
        createGoalDto,
        file.filename,
      );

      response.status(HttpStatus.OK).send({
        message: 'create-challenge',
        data: goal,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('all-goals')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findAll(@Res() response: Response) {
    const goals = await this.goalsService.findAll();

    response.status(HttpStatus.OK).send({
      message: 'all-challanges',
      data: goals,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string, @Res() response: Response) {
    const goal = await this.goalsService.findById(id);
    if (!goal) {
      throw new HttpException('challange-not-found', HttpStatus.NOT_FOUND);
    }

    response.status(HttpStatus.OK).send({
      message: 'challange-data',
      data: goal,
    });
  }

  @Get('find-by-profile/:profileId')
  @UseGuards(JwtAuthGuard)
  async findByProfileId(
    @Param('profileId') profileId: string,
    @Res() response: Response,
  ) {
    const goals = await this.goalsService.findByProfileId(profileId);

    response.status(HttpStatus.OK).send({
      message: 'profile-challanges',
      data: goals,
    });
  }

  @Get('find-by-profile-and-complete-is-false/:profileId')
  @UseGuards(JwtAuthGuard)
  async findByProfileIdAndDoneIsFalse(
    @Param('profileId') profileId: string,
    @Res() response: Response,
  ) {
    const goals =
      await this.goalsService.findByProfileIdAndDoneIsFalse(profileId);

    response.status(HttpStatus.OK).send({
      message: 'profile-challanges',
      data: goals,
    });
  }

  @Get('find-complete-by-profile/:profileId')
  @UseGuards(JwtAuthGuard)
  async findCompleteByProfileId(
    @Param('profileId') profileId: string,
    @Res() response: Response,
  ) {
    const goals = await this.goalsService.findCompleteByProfileId(profileId);

    response.status(HttpStatus.OK).send({
      message: 'complete-challanges',
      data: goals,
    });
  }

  @Get('find-posts-by-profile/:profileId')
  @UseGuards(JwtAuthGuard)
  async findPostsByProfileId(
    @Param('profileId') profileId: string,
    @Res() response: Response,
  ) {
    const posts = await this.goalsService.findPostsByProfileId(profileId);

    response.status(HttpStatus.OK).send({
      message: 'profile-posts',
      data: posts,
    });
  }

  @Get('main-page-posts/:profileId')
  @UseGuards(JwtAuthGuard)
  async findPostsForMainPageByProfileId(
    @Param('profileId') profileId: string,
    @Res() response: Response,
  ) {
    const posts =
      await this.goalsService.findPostsForMainPageByProfileId(profileId);

    response.status(HttpStatus.OK).send({
      message: 'posts-main-page',
      data: posts,
    });
  }

  @Get('get-posts/by-tag')
  @UseGuards(JwtAuthGuard)
  async getPostsByTag(@Query('tag') tag: string, @Res() response: Response) {
    const posts = await this.goalsService.findPostsByTag(tag);

    response.status(HttpStatus.OK).send({
      message: 'posts-by-tag',
      data: posts,
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateGoal(
    @Param('id') id: string,
    @Body() updateGoalDto: Partial<Goal>,
    @Res() response: Response,
  ) {
    try {
      const updatedGoal = await this.goalsService.updateGoal(id, updateGoalDto);
      if (!updatedGoal) {
        throw new HttpException('challange-not-found', HttpStatus.NOT_FOUND);
      }

      response.status(HttpStatus.OK).send({
        message: 'update-challange',
        data: updatedGoal,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteGoal(@Param('id') id: string, @Res() response: Response) {
    const deletedGoal = await this.goalsService.deleteGoal(id);
    if (!deletedGoal) {
      throw new HttpException('challange-not-found', HttpStatus.NOT_FOUND);
    }

    response.status(HttpStatus.OK).send({
      message: 'remove-challange',
      data: deletedGoal,
    });
  }

  @Patch('like-action')
  @UseGuards(JwtAuthGuard)
  async likeActionMethod(
    @Body() likeActionData: likeAction,
    @Res() response: Response,
  ) {
    await this.goalsService.likeActionMethod(likeActionData);

    response.status(HttpStatus.OK).send({
      message: 'like-action-succesfully',
      data: null,
    });
  }
}
