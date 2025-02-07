import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { OpinionsService } from './opinions.service';
import { Response } from 'express';
import { opinionData } from './dto/opinion.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiBearerAuth('access-token')
@Controller('opinions')
export class OpinionsController {
  constructor(private readonly opinionsService: OpinionsService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  async createNewOpinion(
    @Res() response: Response,
    @Body() opinionData: opinionData,
  ) {
    try {
      const res = await this.opinionsService.create(opinionData);

      response.status(HttpStatus.OK).send({
        message: 'successfully-send-opinion',
        data: res,
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        response.status(HttpStatus.BAD_REQUEST).send({
          message: error.message,
        });
      } else {
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          message: 'a-server-error-occurred',
        });
      }
    }
  }

  @Get('all-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllActiveOpinions(@Res() response: Response) {
    try {
      const res = await this.opinionsService.getAllActiveOpinions();

      response.status(HttpStatus.OK).send({
        message: 'successfully-fetch-all-active-opinions',
        data: res,
      });
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'a-server-error-occurred',
      });
    }
  }

  @Put('close/:id')
  @UseGuards(JwtAuthGuard)
  async closeOpinion(@Res() response: Response, @Param('id') id: string) {
    try {
      const res = await this.opinionsService.update(id, { closed: true });

      response.status(HttpStatus.OK).send({
        message: 'opinion-closed',
        data: res,
      });
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'a-server-error-occurred',
      });
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteOpinion(@Res() response: Response, @Param('id') id: string) {
    try {
      const res = await this.opinionsService.delete(id);

      response.status(HttpStatus.OK).send({
        message: 'opinion-deleted',
        data: res,
      });
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'a-server-error-occurred',
      });
    }
  }
}
