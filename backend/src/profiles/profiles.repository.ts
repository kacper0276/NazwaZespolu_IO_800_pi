import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from './entities/profile.entity';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/entities/user.entity';

@Injectable()
export class ProfilesRepository {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
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

  async getFollowersAndFollowing(profileId: string) {
    const profile = await this.profileModel.findById(profileId).exec();

    if (!profile) {
      throw new Error('Profile not found');
    }

    const followersProfileIds = profile.followers;
    const followingProfileIds = profile.following;

    const followersProfiles = await this.profileModel
      .find({ _id: { $in: followersProfileIds } })
      .exec();
    const followingProfiles = await this.profileModel
      .find({ _id: { $in: followingProfileIds } })
      .exec();

    const followersUserIds = followersProfiles.map((profile) => profile.userId);
    const followingUserIds = followingProfiles.map((profile) => profile.userId);

    const followers = await this.userModel
      .find({ _id: { $in: followersUserIds } })
      .exec();
    const following = await this.userModel
      .find({ _id: { $in: followingUserIds } })
      .exec();

    return { followers, following };
  }

  async changeProfileDescription(changeData: {
    profileId: string;
    description: string;
  }) {
    const profile = await this.profileModel
      .findById(changeData.profileId)
      .exec();

    if (!profile) {
      throw new Error('Profile not found');
    }

    profile.description = changeData.description;

    return await profile.save();
  }
}
