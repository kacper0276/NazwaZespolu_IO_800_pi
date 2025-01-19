import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from './entities/profile.entity';
import { Model } from 'mongoose';

@Injectable()
export class ProfilesRepository {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
  ) {}

  async createProfile(profile: Partial<Profile>): Promise<Profile> {
    const newProfile = new this.profileModel(profile);
    return newProfile.save();
  }

  async findAll(): Promise<Profile[]> {
    return this.profileModel.find().exec();
  }

  async findById(id: string): Promise<Profile | null> {
    return this.profileModel.findOne({ _id: id }).exec();
  }

  async findOneByUserId(userId: string): Promise<Profile | null> {
    return this.profileModel.findOne({ userId }).exec();
  }

  async updateProfile(
    id: string,
    updateData: Partial<Profile>,
  ): Promise<Profile | null> {
    return this.profileModel
      .findOneAndUpdate({ _id: id }, updateData, { new: true })
      .exec();
  }

  async deleteProfile(id: number): Promise<Profile | null> {
    return this.profileModel.findOneAndDelete({ id }).exec();
  }
}
