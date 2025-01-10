import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { GoalRepository } from './goals.repository';
import { Goal, GoalSchema } from './entities/goal.entity';
import { Profile, ProfileSchema } from 'src/profiles/entities/profile.entity';
import { Comment, CommentSchema } from 'src/comments/entities/comment.entity';
import { User, UserSchema } from 'src/users/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Goal.name, schema: GoalSchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [GoalsController],
  providers: [GoalsService, GoalRepository],
})
export class GoalsModule {}
