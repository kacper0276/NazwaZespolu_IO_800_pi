import { Injectable } from '@nestjs/common';
import { GoalUpdateRepository } from './goalupdates.repository';
import { GoalUpdate } from './entities/goalupdate.entity';

@Injectable()
export class GoalUpdateService {
  constructor(private readonly goalUpdateRepository: GoalUpdateRepository) {}

  async createGoalUpdate(createGoalUpdateDto: Partial<GoalUpdate>): Promise<GoalUpdate> {
    return this.goalUpdateRepository.createGoalUpdate(createGoalUpdateDto);
  }

  async findAll(): Promise<GoalUpdate[]> {
    return this.goalUpdateRepository.findAll();
  }

  async findById(id: string): Promise<GoalUpdate | null> {
    return this.goalUpdateRepository.findById(id);
  }

  async findByPostId(postId: number): Promise<GoalUpdate[]> {
    return this.goalUpdateRepository.findByPostId(postId);
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
