import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting, SettingDocument } from './entities/setting.entity';

@Injectable()
export class SettingsRepository {
  constructor(
    @InjectModel(Setting.name)
    private readonly settingModel: Model<SettingDocument>,
  ) {}

  async create(setting: Partial<Setting>): Promise<Setting> {
    const newSetting = new this.settingModel(setting);
    return newSetting.save();
  }

  async findAll(): Promise<Setting[]> {
    return this.settingModel.find().exec();
  }

  async findById(id: string): Promise<Setting | null> {
    return this.settingModel.findById(id).exec();
  }

  async findByUserId(userId: string): Promise<Setting[]> {
    return this.settingModel.find({ userId }).exec();
  }

  async update(
    id: string,
    updateData: Partial<Setting>,
  ): Promise<Setting | null> {
    return this.settingModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Setting | null> {
    return this.settingModel.findByIdAndDelete(id).exec();
  }
}
