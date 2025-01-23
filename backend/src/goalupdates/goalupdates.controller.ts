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
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { GoalUpdateService } from './goalupdates.service';
import { GoalUpdate } from './entities/goalupdate.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

const storage = {
  storage: diskStorage({
    destination: '../frontend/public/goalsUpdateImg',
    filename: function (req, file, cb) {
      const name = Date.now() + Math.floor(Math.random() * 100) + '.jpg';

      cb(null, name);
    },
  }),
};

@ApiBearerAuth('access-token')
@Controller('goal-updates')
export class GoalUpdateController {
  constructor(private readonly goalUpdateService: GoalUpdateService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', storage))
  @UseGuards(JwtAuthGuard)
  async createGoalUpdate(
    @Body() createGoalUpdateDto: Partial<GoalUpdate>,
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response,
  ) {
    try {
      const goalUpdate = await this.goalUpdateService.createGoalUpdate(
        createGoalUpdateDto,
        file ? file.filename : '',
      );

      response.status(HttpStatus.CREATED).send({
        message: 'create-challangeupdate',
        data: goalUpdate,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('all-goalupdates')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findAll(@Res() response: Response) {
    const goalUpdates = await this.goalUpdateService.findAll();

    response.status(HttpStatus.OK).send({
      message: 'all-challangeupdates',
      data: goalUpdates,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string, @Res() response: Response) {
    const goalUpdate = await this.goalUpdateService.findById(id);
    if (!goalUpdate) {
      throw new HttpException(
        'challange-update-not-found',
        HttpStatus.NOT_FOUND,
      );
    }

    response.status(HttpStatus.OK).send({
      message: 'challangeupdate-data',
      data: goalUpdate,
    });
  }

  @Get('goal/:goalId')
  @UseGuards(JwtAuthGuard)
  async findByPostId(
    @Param('goalId') goalId: string,
    @Res() response: Response,
  ) {
    const goalUpdates = await this.goalUpdateService.findByGoalId(goalId);

    response.status(HttpStatus.OK).send({
      message: 'goalchallange-for-post',
      data: goalUpdates,
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateGoalUpdate(
    @Param('id') id: string,
    @Body() updateGoalUpdateDto: Partial<GoalUpdate>,
    @Res() response: Response,
  ) {
    try {
      const updatedGoalUpdate = await this.goalUpdateService.updateGoalUpdate(
        id,
        updateGoalUpdateDto,
      );
      if (!updatedGoalUpdate) {
        throw new HttpException(
          'challange-update-not-found',
          HttpStatus.NOT_FOUND,
        );
      }

      response.status(HttpStatus.OK).send({
        message: 'update-challangeupdate',
        data: updatedGoalUpdate,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteGoalUpdate(@Param('id') id: string, @Res() response: Response) {
    const deletedGoalUpdate = await this.goalUpdateService.deleteGoalUpdate(id);
    if (!deletedGoalUpdate) {
      throw new HttpException(
        'challange-update-not-found',
        HttpStatus.NOT_FOUND,
      );
    }

    response.status(HttpStatus.OK).send({
      message: 'remove-challangeupdate',
      data: deletedGoalUpdate,
    });
  }
}
