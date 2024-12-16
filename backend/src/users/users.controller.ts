import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { UserData } from './types/user.type';
import { UsersService } from './users.service';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('login')
  async login(@Body() userData: UserData, @Res() response: Response) {
    try {
      const res = await this.userService.loginUser(userData);

      response.status(HttpStatus.OK).send({
        message: 'successfully-logged-in',
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

  @Patch('activate-account')
  async activateAccount(
    @Query('userEmail') userEmail: string,
    @Res() response: Response,
  ) {
    console.log(userEmail);
    try {
      await this.userService.activateAccount(userEmail);
      response.status(HttpStatus.OK).send({
        message: 'your-account-has-been-successfully-activated',
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
