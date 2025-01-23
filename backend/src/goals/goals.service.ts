import { Injectable } from '@nestjs/common';
import { GoalRepository } from './goals.repository';
import { Goal } from './entities/goal.entity';
import { likeAction } from './dto/likeAction.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

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
    return this.goalsRepository.findByProfileId(profileId);
  }

  async findByProfileIdAndDoneIsFalse(
    profileId: string,
  ): Promise<Goal[] | null> {
    return this.goalsRepository.findByProfileIdAndDoneIsFalse(profileId);
  }

  async findCompleteByProfileId(profileId: string): Promise<Goal[] | null> {
    return this.goalsRepository.findCompleteByProfileId(profileId);
  }

  async findPostsByProfileId(profileId: string): Promise<Goal[] | null> {
    return this.goalsRepository.findPostsByProfileId(profileId);
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

  async likeActionMethod(likeActionData: likeAction) {
    return this.goalsRepository.likeActionMethod(likeActionData);
  }

  async findPostsForMainPageByProfileId(profileId: string) {
    return this.goalsRepository.findPostsForMainPageByProfileId(profileId);
  }

  async findPostsByTag(tag: string) {
    return this.goalsRepository.findPostsByTag(tag);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkGoalsEndDate() {
    const goals = await this.findAll();
    const currentDate = new Date();

    for (const goal of goals) {
      if (goal.endDate < currentDate && !goal.isDone) {
        await this.updateGoal(goal.id, { isDone: true });
      }
    }
  }
}
