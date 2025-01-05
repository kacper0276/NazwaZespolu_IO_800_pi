import { Injectable } from '@nestjs/common';
import { GoalRepository } from './goals.repository';
import { Goal } from './entities/goal.entity';

@Injectable()
export class GoalService {
  constructor(private readonly goalRepository: GoalRepository) {}

  async createGoal(createGoalDto: Partial<Goal>): Promise<Goal> {
    return this.goalRepository.createGoal(createGoalDto);
  }

  async findAll(): Promise<Goal[]> {
    return this.goalRepository.findAll();
  }

  async findById(id: number): Promise<Goal | null> {
    return this.goalRepository.findById(id);
  }

  async updateGoal(id: number, updateGoalDto: Partial<Goal>): Promise<Goal | null> {
    return this.goalRepository.updateGoal(id, updateGoalDto);
  }

  async deleteGoal(id: number): Promise<Goal | null> {
    return this.goalRepository.deleteGoal(id);
  }
}