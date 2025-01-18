import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoalUpdateController } from './goalupdates.controller';
import { GoalUpdateService } from './goalupdates.service';
import { GoalUpdateRepository } from './goalupdates.repository';
import { GoalUpdate, GoalUpdateSchema } from './entities/goalupdate.entity';
import { Goal, GoalSchema } from 'src/goals/entities/goal.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GoalUpdate.name, schema: GoalUpdateSchema },
      { name: Goal.name, schema: GoalSchema },
    ]),
  ],
  controllers: [GoalUpdateController],
  providers: [GoalUpdateService, GoalUpdateRepository],
})
export class GoalUpdateModule {}
