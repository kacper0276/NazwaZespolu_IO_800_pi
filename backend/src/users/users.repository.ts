import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Profile, ProfileDocument } from 'src/profiles/entities/profile.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findActivateAccountByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email: email, isActivated: true }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findOne({ _id: id }).exec();
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, updates, { new: true }).exec();
  }

  async delete(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async deleteInactiveUsers(): Promise<number> {
    const result = await this.userModel
      .deleteMany({ isActivated: false })
      .exec();
    return result.deletedCount;
  }

  async searchUsersByQuery(query: string): Promise<User[]> {
    const searchRegex = new RegExp(query, 'i');
    return this.userModel
      .find({
        $or: [
          { email: searchRegex },
          { firstName: searchRegex },
          { lastName: searchRegex },
        ],
      })
      .exec();
  }

  async activateAccountAndCreateProfile(userEmail: string): Promise<User> {
    const user = await this.findByEmail(userEmail);

    if (!user) {
      throw new Error('User not found');
    }

    const profileData = {
      userId: user._id,
      currentGoals: [],
      completedGoals: [],
      followers: [],
      following: [],
      premium: false,
      user: user,
    };

    const profile = new this.profileModel(profileData);
    await profile.save();

    user.isActivated = true;
    user.profileId = profile.id;
    user.profile = profile;

    const updatedUser = await this.userModel.findByIdAndUpdate(
      user._id,
      {
        isActivated: user.isActivated,
        profileId: user.profileId,
        profile: user.profile,
      },
      { new: true },
    );

    return updatedUser;
  }
}
