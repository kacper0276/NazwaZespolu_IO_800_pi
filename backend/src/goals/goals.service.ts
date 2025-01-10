import { Injectable } from '@nestjs/common';
import { GoalRepository } from './goals.repository';
import { Goal } from './entities/goal.entity';

@Injectable()
export class GoalsService {
  constructor(private readonly goalsRepository: GoalRepository) {}

  async createGoal(
    createGoalDto: Partial<Goal>,
    imgName: string,
  ): Promise<Goal> {
    if (typeof createGoalDto.tags === 'string') {
      createGoalDto.tags = JSON.parse(createGoalDto.tags);
    }

    createGoalDto.image = imgName;

    return this.goalsRepository.createGoal(createGoalDto);
  }

  async findAll(): Promise<Goal[]> {
    return this.goalsRepository.findAll();
  }

  async findById(id: number): Promise<Goal | null> {
    return this.goalsRepository.findById(id);
  }

  async findByProfileId(profileId: string): Promise<Goal[] | null> {
    return this.goalRepository.findByProfileId(profileId);
  }

  async updateGoal(
    id: number,
    updateGoalDto: Partial<Goal>,
  ): Promise<Goal | null> {
    return this.goalsRepository.updateGoal(id, updateGoalDto);
  }

  async deleteGoal(id: number): Promise<Goal | null> {
    return this.goalsRepository.deleteGoal(id);
  }
}
