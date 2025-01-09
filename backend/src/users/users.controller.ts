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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserData } from './types/user.type';
import { UsersService } from './users.service';
import { Response } from 'express';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { User } from './entities/user.entity';

const storageProfileImage = {
  storage: diskStorage({
    destination: '../frontend/public/profileImages',
    filename: (req, file, cb) => {
      const name = Date.now() + Math.floor(Math.random() * 100) + '.jpg';
      cb(null, name);
    },
  }),
};

const storageBackgroundImage = {
  storage: diskStorage({
    destination: '../frontend/public/backgroundImages',
    filename: (req, file, cb) => {
      const name = Date.now() + Math.floor(Math.random() * 100) + '.jpg';
      cb(null, name);
    },
  }),
};

@ApiBearerAuth('access-token')
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
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'profileImage', maxCount: 1 },
        { name: 'backgroundImage', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            if (file.fieldname === 'profileImage') {
              cb(null, '../frontend/public/profileImages');
            } else if (file.fieldname === 'backgroundImage') {
              cb(null, '../frontend/public/backgroundImages');
            }
          },
          filename: (req, file, cb) => {
            const name = Date.now() + Math.floor(Math.random() * 100) + '.jpg';
            cb(null, name);
          },
        }),
      },
    ),
  )
  async editUserData(
    @Param('userId') userId: string,
    @Body() userData: Partial<User>,
    @UploadedFiles()
    files: {
      profileImage?: Express.Multer.File[];
      backgroundImage?: Express.Multer.File[];
    },
    @Res() response: Response,
  ) {
    try {
      if (files.profileImage) {
        userData.profileImage = `${files.profileImage[0].filename}`;
      }
      if (files.backgroundImage) {
        userData.backgroundImage = `  ${files.backgroundImage[0].filename}`;
      }

      const updatedUser = await this.usersService.updateUser(userId, userData);

      response.status(HttpStatus.OK).send({
        message: 'user-details-successfully-changed',
        data: updatedUser,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'a-server-error-occurred',
      });
    }
  }
}
