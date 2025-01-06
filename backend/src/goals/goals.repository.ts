import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Goal, GoalDocument } from './entities/goal.entity';
import { Model } from 'mongoose';

@Injectable()
export class GoalRepository {
  constructor(
    @InjectModel(Goal.name) private readonly goalModel: Model<GoalDocument>,
  ) {}

  async createGoal(goal: Partial<Goal>): Promise<Goal> {
    const newGoal = new this.goalModel(goal);
    return newGoal.save();
  }

  async findAll(): Promise<Goal[]> {
    return this.goalModel.find().exec();
  }

  async findById(id: number): Promise<Goal | null> {
    return this.goalModel.findById(id).exec();
  }

  async updateGoal(id: number, updateData: Partial<Goal>): Promise<Goal | null> {
    return this.goalModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async deleteGoal(id: number): Promise<Goal | null> {
    return this.goalModel.findByIdAndDelete(id).exec();
  }
}