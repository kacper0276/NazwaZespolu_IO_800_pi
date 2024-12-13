import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { UserData } from './types/user.type';
import { UsersService } from './users.service';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('login')
  login(@Body() userData: UserData) {
    console.log(userData);
  }

  @Post('register')
  async register(@Body() userData: UserData, @Res() response: Response) {
    try {
      await this.userService.registerUser(userData);

      response.status(HttpStatus.CREATED).send({
        message: 'user-registered',
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
