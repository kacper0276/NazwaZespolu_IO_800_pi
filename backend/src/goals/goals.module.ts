import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoalsController } from './goals.controller';
import { GoalService } from './goals.service';
import { GoalRepository } from './goals.repository';
import { Goal, GoalSchema } from './entities/goal.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Goal.name, schema: GoalSchema }]),
  ],
  controllers: [GoalsController],
  providers: [GoalService, GoalRepository],
})
export class GoalsModule {}