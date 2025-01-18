import { Injectable } from '@nestjs/common';
import { GoalUpdateRepository } from './goalupdates.repository';
import { GoalUpdate } from './entities/goalupdate.entity';

@Injectable()
export class GoalUpdateService {
  constructor(private readonly goalUpdateRepository: GoalUpdateRepository) {}

  async createGoalUpdate(
    createGoalUpdateDto: Partial<GoalUpdate>,
    imgName: string,
  ): Promise<GoalUpdate> {
    createGoalUpdateDto.filename = imgName;
    createGoalUpdateDto.createdAt = new Date();

    return this.goalUpdateRepository.createGoalUpdate(createGoalUpdateDto);
  }

  async findAll(): Promise<GoalUpdate[]> {
    return this.goalUpdateRepository.findAll();
  }

  async findById(id: string): Promise<GoalUpdate | null> {
    return this.goalUpdateRepository.findById(id);
  }

  async findByGoalId(goalId: string): Promise<GoalUpdate[]> {
    return this.goalUpdateRepository.findByGoalId(goalId);
  }

  async updateGoalUpdate(
    id: string,
    updateGoalUpdateDto: Partial<GoalUpdate>,
  ): Promise<GoalUpdate | null> {
    return this.goalUpdateRepository.updateGoalUpdate(id, updateGoalUpdateDto);
  }

  async deleteGoalUpdate(id: string): Promise<GoalUpdate | null> {
    return this.goalUpdateRepository.deleteGoalUpdate(id);
  }
}
