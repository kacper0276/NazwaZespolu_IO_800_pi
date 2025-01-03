import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserData } from './types/user.type';
import { UsersService } from './users.service';
import { Response } from 'express';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body() userData: UserData, @Res() response: Response) {
    try {
      const res = await this.usersService.loginUser(userData);

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
      await this.usersService.registerUser(userData);

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
    try {
      await this.usersService.activateAccount(userEmail);
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

  @Get('search')
  async searchUsers(@Query('query') query: string, @Res() response: Response) {
    try {
      const users = await this.usersService.searchUsers(query);

      response.status(HttpStatus.OK).send({
        message: 'search-results',
        data: users,
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

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllUsers(@Res() response: Response) {
    try {
      const users = await this.usersService.getAllUsers();

      response.status(HttpStatus.OK).send({
        message: 'all-users',
        data: users,
      });
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'a-server-error-occurred',
      });
    }
  }

  @Delete(':userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteUser(@Param('userId') userId: string, @Res() response: Response) {
    try {
      await this.usersService.deleteUser(userId);

      response.status(HttpStatus.OK).send({
        message: 'remove-user',
        data: null,
      });
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'a-server-error-occurred',
      });
    }
  }

  @Put(':userId')
  async editUserData(
    @Param('userId') userId: string,
    @Body() userData: UserData,
    @Res() response: Response,
  ) {
    try {
      const user = await this.usersService.updateUser(userId, userData);

      response.status(HttpStatus.OK).send({
        message: 'user-details-successfully-changed',
        data: user,
      });
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'a-server-error-occurred',
      });
    }
  }
}
