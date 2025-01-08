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
} from '@nestjs/common';
import { GoalService } from './goals.service';
import { Goal } from './entities/goal.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

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
  constructor(private readonly goalService: GoalService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', storage))
  async createGoal(
    @Body() createGoalDto: Partial<Goal>,
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response,
  ) {
    try {
      const goal = await this.goalService.createGoal(
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

  @Get()
  async findAll(): Promise<Goal[]> {
    return await this.goalService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Goal> {
    const goal = await this.goalService.findById(Number(id));
    if (!goal) {
      throw new HttpException('Goal not found', HttpStatus.NOT_FOUND);
    }
    return goal;
  }

  @Put(':id')
  async updateGoal(
    @Param('id') id: string,
    @Body() updateGoalDto: Partial<Goal>,
  ): Promise<Goal> {
    try {
      const updatedGoal = await this.goalService.updateGoal(
        Number(id),
        updateGoalDto,
      );
      if (!updatedGoal) {
        throw new HttpException('Goal not found', HttpStatus.NOT_FOUND);
      }
      return updatedGoal;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async deleteGoal(@Param('id') id: string): Promise<Goal> {
    const deletedGoal = await this.goalService.deleteGoal(Number(id));
    if (!deletedGoal) {
      throw new HttpException('Goal not found', HttpStatus.NOT_FOUND);
    }
    return deletedGoal;
  }
}
