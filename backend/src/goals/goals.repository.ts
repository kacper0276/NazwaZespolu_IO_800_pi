import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Goal, GoalDocument } from './entities/goals.entity';
import { Model } from 'mongoose';

@Injectable()
export class GoalsRepository {
  constructor(
    @InjectModel(Goal.name) private readonly goalModel: Model<GoalDocument>,
  ) {}
}
