import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { GoalRepository } from './goals.repository';
import { Goal, GoalSchema } from './entities/goal.entity';
import { Profile, ProfileSchema } from 'src/profiles/entities/profile.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Goal.name, schema: GoalSchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
  ],
  controllers: [GoalsController],
  providers: [GoalsService, GoalRepository],
})
export class GoalsModule {}
