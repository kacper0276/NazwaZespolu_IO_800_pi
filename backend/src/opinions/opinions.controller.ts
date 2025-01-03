import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { OpinionsService } from './opinions.service';
import { Response } from 'express';
import { opinionData } from './dto/opinion.dto';

@Controller('opinions')
export class OpinionsController {
  constructor(private readonly opinionsService: OpinionsService) {}

  @Post('')
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
}
