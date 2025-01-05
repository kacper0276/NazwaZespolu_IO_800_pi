import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { Profile } from './entities/profile.entity';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  async createProfile(@Body() createProfileDto: Partial<Profile>): Promise<Profile> {
    try {
      return await this.profilesService.createProfile(createProfileDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(): Promise<Profile[]> {
    return await this.profilesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Profile> {
    const profile = await this.profilesService.findById(id);
    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }
    return profile;
  }

  @Put(':id')
  async updateProfile(
    @Param('id') id: number,
    @Body() updateProfileDto: Partial<Profile>,
  ): Promise<Profile> {
    try {
      const updatedProfile = await this.profilesService.updateProfile(id, updateProfileDto);
      if (!updatedProfile) {
        throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
      }
      return updatedProfile;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async deleteProfile(@Param('id') id: number): Promise<Profile> {
    const deletedProfile = await this.profilesService.deleteProfile(id);
    if (!deletedProfile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }
    return deletedProfile;
  }
}