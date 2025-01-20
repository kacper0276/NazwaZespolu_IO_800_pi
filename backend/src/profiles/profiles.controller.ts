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
  Patch,
  Query,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { Profile } from './entities/profile.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';

@ApiBearerAuth('access-token')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  async createProfile(
    @Body() createProfileDto: Partial<Profile>,
    @Res() response: Response,
  ) {
    try {
      const profile =
        await this.profilesService.createProfile(createProfileDto);

      response.status(HttpStatus.OK).send({
        message: 'create-profile',
        data: profile,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(@Res() response: Response) {
    const profiles = await this.profilesService.findAll();

    response.status(HttpStatus.OK).send({
      message: 'all-profiles',
      data: profiles,
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Res() response: Response) {
    const profile = await this.profilesService.findById(id);
    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    response.status(HttpStatus.OK).send({
      message: 'profile-data',
      data: profile,
    });
  }

  @Get('get-profile-by-user/:userId')
  async getProfileByUser(
    @Param('userId') userId: string,
    @Res() response: Response,
  ) {
    const profile = await this.profilesService.findByUserId(userId);
    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    response.status(HttpStatus.OK).send({
      message: 'profile-data',
      data: profile,
    });
  }

  @Get('followers-following-list/:id')
  async getFollowersAndFollowing(
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    try {
      const users = await this.profilesService.getFollowersAndFollowing(id);

      response.status(HttpStatus.OK).send({
        message: 'followers-and-following',
        data: users,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Put(':id')
  async updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: Partial<Profile>,
    @Res() response: Response,
  ) {
    try {
      const updatedProfile = await this.profilesService.updateProfile(
        id,
        updateProfileDto,
      );
      if (!updatedProfile) {
        throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
      }

      response.status(HttpStatus.OK).send({
        message: 'update-profile',
        data: updatedProfile,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('follow')
  async followAction(
    @Query('follower') follower: string,
    @Query('followee') followee: string,
    @Res() response: Response,
  ) {
    try {
      await this.profilesService.followAction(follower, followee);

      response.status(HttpStatus.OK).send({
        message: 'follow-action-successful',
        data: null,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Patch('change-profile-description')
  async changeProfileDescription(
    @Body() changeData: { profileId: string; description: string },
    @Res() response: Response,
  ) {
    try {
      await this.profilesService.changeProfileDescription(changeData);

      response.status(HttpStatus.OK).send({
        message: 'successful-change-description',
        data: null,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Delete(':id')
  async deleteProfile(@Param('id') id: number, @Res() response: Response) {
    const deletedProfile = await this.profilesService.deleteProfile(id);
    if (!deletedProfile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    response.status(HttpStatus.OK).send({
      message: 'remove-profile',
      data: deletedProfile,
    });
  }
}
