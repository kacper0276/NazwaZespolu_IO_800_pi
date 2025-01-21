import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Setting } from './entities/setting.entity';

@ApiBearerAuth('access-token')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  async createSetting(@Body() setting: Partial<Setting>): Promise<Setting> {
    return this.settingsService.createSetting(setting);
  }

  @Get()
  async getAllSettings(): Promise<Setting[]> {
    return this.settingsService.getAllSettings();
  }

  @Get(':id')
  async getSettingById(@Param('id') id: string): Promise<Setting> {
    return this.settingsService.getSettingById(id);
  }

  @Get('user/:userId')
  async getSettingsByUserId(
    @Param('userId') userId: string,
  ): Promise<Setting[]> {
    return this.settingsService.getSettingsByUserId(userId);
  }

  @Put(':id')
  async updateSetting(
    @Param('id') id: string,
    @Body() updateData: Partial<Setting>,
  ): Promise<Setting> {
    return this.settingsService.updateSetting(id, updateData);
  }

  @Delete(':id')
  async deleteSetting(@Param('id') id: string): Promise<Setting> {
    return this.settingsService.deleteSetting(id);
  }
}
