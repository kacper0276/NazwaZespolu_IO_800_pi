import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GoalUpdate, GoalUpdateDocument } from './entities/goalupdate.entity';

@Injectable()
export class GoalUpdateRepository {
  constructor(
    @InjectModel(GoalUpdate.name)
    private readonly goalUpdateModel: Model<GoalUpdateDocument>,
  ) {}

  async createGoalUpdate(goalUpdateData: Partial<GoalUpdate>): Promise<GoalUpdate> {
    const newGoalUpdate = new this.goalUpdateModel(goalUpdateData);
    return newGoalUpdate.save();
  }

  async findAll(): Promise<GoalUpdate[]> {
    return this.goalUpdateModel.find().exec();
  }

  async findById(id: string): Promise<GoalUpdate | null> {
    return this.goalUpdateModel.findById(id).exec();
  }

  async findByPostId(postId: number): Promise<GoalUpdate[]> {
    return this.goalUpdateModel.find({ postId }).exec();
  }

  async updateGoalUpdate(
    id: string,
    updateData: Partial<GoalUpdate>,
  ): Promise<GoalUpdate | null> {
    return this.goalUpdateModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async deleteGoalUpdate(id: string): Promise<GoalUpdate | null> {
    return this.goalUpdateModel.findByIdAndDelete(id).exec();
  }
}
