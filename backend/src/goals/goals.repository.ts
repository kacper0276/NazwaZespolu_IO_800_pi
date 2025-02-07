import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Goal, GoalDocument } from './entities/goal.entity';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from 'src/profiles/entities/profile.entity';
import { Comment, CommentDocument } from 'src/comments/entities/comment.entity';
import { User, UserDocument } from 'src/users/entities/user.entity';
import { likeAction } from './dto/likeAction.dto';

@Injectable()
export class GoalRepository {
  constructor(
    @InjectModel(Goal.name)
    private readonly goalModel: Model<GoalDocument>,
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createGoal(goal: Partial<Goal>): Promise<Goal> {
    const newGoal = new this.goalModel(goal);
    const profile = await this.profileModel.findOne({ _id: goal.profileId });

    if (profile) {
      profile.currentGoals.push(newGoal.id);
      await profile.save();
    }

    return newGoal.save();
  }

  async findAll(): Promise<Goal[]> {
    return this.goalModel.find().exec();
  }

  async findById(id: string): Promise<Goal | null> {
    return this.goalModel.findById({ _id: id }).exec();
  }

  async findByProfileId(profileId: string): Promise<Goal[] | null> {
    const goals = await this.goalModel.find({ profileId }).exec();

    return goals;
  }

  async findByProfileIdAndDoneIsFalse(
    profileId: string,
  ): Promise<Goal[] | null> {
    return await this.goalModel.find({ profileId, isDone: false }).exec();
  }

  async findCompleteByProfileId(profileId: string): Promise<Goal[] | null> {
    return await this.goalModel.find({ profileId, isDone: true }).exec();
  }

  async findPostsByProfileId(profileId: string): Promise<Goal[] | null> {
    const goals = await this.goalModel.find({ profileId, isPost: true }).exec();

    return goals;
  }

  async updateGoal(
    id: string,
    updateData: Partial<Goal>,
  ): Promise<Goal | null> {
    return this.goalModel
      .findByIdAndUpdate({ _id: id }, updateData, { new: true })
      .exec();
  }

  async deleteGoal(id: string): Promise<Goal | null> {
    return this.goalModel.findByIdAndDelete(id).exec();
  }

  async likeActionMethod(likeActionData: likeAction) {
    const user = await this.userModel.findById(likeActionData.userId);
    const post = await this.goalModel.findById(likeActionData.postId);

    const postIndex = user.likedPost.indexOf(post._id.toString());

    if (postIndex !== -1) {
      user.likedPost.splice(postIndex, 1);
      post.reactions = Math.max(0, post.reactions - 1);
    } else {
      user.likedPost.push(post._id.toString());
      post.reactions = (post.reactions || 0) + 1;
    }

    await user.save();
    await post.save();
  }

  async findPostsForMainPageByProfileId(profileId: string) {
    const profile = await this.profileModel.findById(profileId).exec();

    if (!profile) {
      return null;
    }

    const followedProfilesIds = profile.following;

    if (followedProfilesIds.length === 0) {
      return [];
    }

    const posts = await this.goalModel
      .find({
        profileId: { $in: followedProfilesIds },
        isPost: true,
        visibility: 'public',
      })
      .sort({ startDate: -1 })
      .exec();

    const postsWithUserName = await Promise.all(
      posts.map(async (post) => {
        const profile = await this.profileModel.findById(post.profileId).exec();
        let userName = '';

        if (profile) {
          const user = await this.userModel
            .findById(profile.userId)
            .select('firstname lastname')
            .exec();

          if (user) {
            userName = `${user.firstname} ${user.lastname}`;
          }
        }

        return { ...post.toObject(), userName };
      }),
    );

    return postsWithUserName;
  }

  async findPostsByTag(tag: string) {
    const posts = await this.goalModel
      .find({
        tags: { $elemMatch: { $regex: tag, $options: 'i' } },
        isPost: true,
        visibility: 'public',
      })
      .sort({ startDate: -1 })
      .exec();

    return posts;
  }
}
