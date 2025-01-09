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
      const profile = await this.profilesService.createProfile(
        createProfileDto,
      );

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
  async findById(@Param('id') id: number, @Res() response: Response) {
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

  @Put(':id')
  async updateProfile(
    @Param('id') id: number,
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
