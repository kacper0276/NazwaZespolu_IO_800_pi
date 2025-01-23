import { Injectable, NotFoundException } from '@nestjs/common';
import { SettingsRepository } from './settings.repository';
import { Setting } from './entities/setting.entity';

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  async createSetting(setting: Partial<Setting>): Promise<Setting> {
    const existingSettings = await this.settingsRepository.findByUserId(
      setting.userId,
    );

    if (existingSettings && existingSettings.length > 0) {
      const existingSetting = existingSettings[0];
      const updatedData = { ...existingSetting.data };

      for (const [key, value] of Object.entries(setting.data)) {
        if (existingSetting.data[key] !== value) {
          updatedData[key] = value;
        }
      }

      const updatedSetting = await this.settingsRepository.updateByUserId(
        setting.userId,
        {
          data: updatedData,
        },
      );

      if (!updatedSetting) {
        throw new NotFoundException(
          `Setting for user with id ${setting.userId} not found`,
        );
      }
      return updatedSetting;
    }

    return this.settingsRepository.create(setting);
  }

  async getAllSettings(): Promise<Setting[]> {
    return this.settingsRepository.findAll();
  }

  async getSettingById(id: string): Promise<Setting> {
    const setting = await this.settingsRepository.findById(id);
    if (!setting) {
      throw new NotFoundException(`Setting with id ${id} not found`);
    }
    return setting;
  }

  async getSettingsByUserId(userId: string): Promise<Setting[]> {
    return this.settingsRepository.findByUserId(userId);
  }

  async updateSetting(
    id: string,
    updateData: Partial<Setting>,
  ): Promise<Setting> {
    const updatedSetting = await this.settingsRepository.update(id, updateData);
    if (!updatedSetting) {
      throw new NotFoundException(`Setting with id ${id} not found`);
    }
    return updatedSetting;
  }

  async deleteSetting(id: string): Promise<Setting> {
    const deletedSetting = await this.settingsRepository.delete(id);
    if (!deletedSetting) {
      throw new NotFoundException(`Setting with id ${id} not found`);
    }
    return deletedSetting;
  }
}
