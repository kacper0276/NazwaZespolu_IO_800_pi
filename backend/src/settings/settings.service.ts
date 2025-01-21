import { Injectable, NotFoundException } from '@nestjs/common';
import { SettingsRepository } from './settings.repository';
import { Setting } from './entities/setting.entity';

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  async createSetting(setting: Partial<Setting>): Promise<Setting> {
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
