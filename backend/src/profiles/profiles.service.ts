import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProfilesRepository } from './profiles.repository';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfilesService {
  constructor(private readonly profilesRepository: ProfilesRepository) {}

  async createProfile(createProfileDto: Partial<Profile>): Promise<Profile> {
    return this.profilesRepository.createProfile(createProfileDto);
  }

  async findAll(): Promise<Profile[]> {
    return this.profilesRepository.findAll();
  }

  async findById(id: string): Promise<Profile | null> {
    return this.profilesRepository.findById(id);
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    return this.profilesRepository.findOneByUserId(userId);
  }

  async updateProfile(
    id: string,
    updateProfileDto: Partial<Profile>,
  ): Promise<Profile | null> {
    return this.profilesRepository.updateProfile(id, updateProfileDto);
  }

  async deleteProfile(id: number): Promise<Profile | null> {
    return this.profilesRepository.deleteProfile(id);
  }

  async followAction(follower: string, followee: string) {
    const followeeProfile = await this.profilesRepository.findById(followee);
    const followerProfile = await this.profilesRepository.findById(follower);

    if (!followeeProfile || !followerProfile) {
      throw new HttpException('not-found-user', HttpStatus.BAD_REQUEST);
    }

    const isFollowing = followerProfile.following.includes(followee);

    if (isFollowing) {
      followerProfile.following = followerProfile.following.filter(
        (id) => id !== followee,
      );
      followeeProfile.followers = followeeProfile.followers.filter(
        (id) => id !== follower,
      );
    } else {
      followerProfile.following.push(followee);
      followeeProfile.followers.push(follower);
    }

    await this.profilesRepository.updateProfile(String(followerProfile._id), {
      following: followerProfile.following,
    });
    await this.profilesRepository.updateProfile(String(followeeProfile._id), {
      followers: followeeProfile.followers,
    });
  }

  async getFollowersAndFollowing(profileId: string) {
    return this.profilesRepository.getFollowersAndFollowing(profileId);
  }
}
