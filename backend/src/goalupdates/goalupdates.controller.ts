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
  import { GoalUpdateService } from './goalupdates.service';
  import { GoalUpdate } from './entities/goalupdate.entity';
  import { ApiBearerAuth } from '@nestjs/swagger';
  import { Response } from 'express';
  
  @ApiBearerAuth('access-token')
  @Controller('goalupdates')
  export class GoalUpdateController {
    constructor(private readonly goalUpdateService: GoalUpdateService) {}
  
    @Post()
    async createGoalUpdate(
      @Body() createGoalUpdateDto: Partial<GoalUpdate>,
      @Res() response: Response,
    ) {
      try {
        const goalUpdate = await this.goalUpdateService.createGoalUpdate(
          createGoalUpdateDto,
        );
  
        response.status(HttpStatus.CREATED).send({
          message: 'create-challangeupdate',
          data: goalUpdate,
        });
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  
    @Get()
    async findAll(@Res() response: Response) {
      const goalUpdates = await this.goalUpdateService.findAll();
  
      response.status(HttpStatus.OK).send({
        message: 'all-challangeupdates',
        data: goalUpdates,
      });
    }
  
    @Get(':id')
    async findById(@Param('id') id: string, @Res() response: Response) {
      const goalUpdate = await this.goalUpdateService.findById(id);
      if (!goalUpdate) {
        throw new HttpException('Challange update not found', HttpStatus.NOT_FOUND);
      }
  
      response.status(HttpStatus.OK).send({
        message: 'challangeupdate-data',
        data: goalUpdate,
      });
    }
  
    @Get('post/:postId')
    async findByPostId(
      @Param('postId') postId: number,
      @Res() response: Response,
    ) {
      const goalUpdates = await this.goalUpdateService.findByPostId(postId);
      if (!goalUpdates || goalUpdates.length === 0) {
        throw new HttpException('No challange updates found for this post', HttpStatus.NOT_FOUND);
      }
  
      response.status(HttpStatus.OK).send({
        message: 'goalchallange-for-post',
        data: goalUpdates,
      });
    }
  
    @Put(':id')
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
          throw new HttpException('Challange update not found', HttpStatus.NOT_FOUND);
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
    async deleteGoalUpdate(@Param('id') id: string, @Res() response: Response) {
      const deletedGoalUpdate = await this.goalUpdateService.deleteGoalUpdate(id);
      if (!deletedGoalUpdate) {
        throw new HttpException('Challange update not found', HttpStatus.NOT_FOUND);
      }
  
      response.status(HttpStatus.OK).send({
        message: 'remove-challangeupdate',
        data: deletedGoalUpdate,
      });
    }
  }
  