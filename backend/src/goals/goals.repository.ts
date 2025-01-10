import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Goal, GoalDocument } from './entities/goal.entity';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from 'src/profiles/entities/profile.entity';

@Injectable()
export class GoalRepository {
  constructor(
    @InjectModel(Goal.name) private readonly goalModel: Model<GoalDocument>,
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  async createGoal(goal: Partial<Goal>): Promise<Goal> {
    const newGoal = new this.goalModel(goal);
    const profile = await this.profileModel.findOne({ _id: goal.profileId });

    if (profile) {
      profile.currentGoals.push(newGoal.id);
      await profile.save();
    }

    return newGoal.save();
  }

  async findAll(): Promise<Goal[]> {
    return this.goalModel.find().exec();
  }

  async findById(id: number): Promise<Goal | null> {
    return this.goalModel.findById(id).exec();
  }

  async findByProfileId(profileId: string): Promise<Goal[] | null> {
    return this.goalModel.find({ profileId }).exec();
  }

  async findPostsByProfileId(profileId: string): Promise<Goal[] | null> {
    return this.goalModel.find({ profileId, isPost: true }).exec();
  }

  async updateGoal(
    id: number,
    updateData: Partial<Goal>,
  ): Promise<Goal | null> {
    return this.goalModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async deleteGoal(id: number): Promise<Goal | null> {
    return this.goalModel.findByIdAndDelete(id).exec();
  }
}
