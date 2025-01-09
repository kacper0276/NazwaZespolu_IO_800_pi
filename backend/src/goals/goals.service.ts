import { Injectable } from '@nestjs/common';
import { GoalRepository } from './goals.repository';
import { Goal } from './entities/goal.entity';

@Injectable()
export class GoalService {
  constructor(private readonly goalRepository: GoalRepository) {}

  async createGoal(
    createGoalDto: Partial<Goal>,
    imgName: string,
  ): Promise<Goal> {
    if (typeof createGoalDto.tags === 'string') {
      createGoalDto.tags = JSON.parse(createGoalDto.tags);
    }

    createGoalDto.image = imgName;

    return this.goalRepository.createGoal(createGoalDto);
  }

  async findAll(): Promise<Goal[]> {
    return this.goalRepository.findAll();
  }

  async findById(id: number): Promise<Goal | null> {
    return this.goalRepository.findById(id);
  }

  async findByProfileId(profileId: string): Promise<Goal[] | null> {
    return this.goalRepository.findByProfileId(profileId);
  }

  async updateGoal(
    id: number,
    updateGoalDto: Partial<Goal>,
  ): Promise<Goal | null> {
    return this.goalRepository.updateGoal(id, updateGoalDto);
  }

  async deleteGoal(id: number): Promise<Goal | null> {
    return this.goalRepository.deleteGoal(id);
  }
}
