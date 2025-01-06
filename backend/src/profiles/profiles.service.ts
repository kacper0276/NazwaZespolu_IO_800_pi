import { Injectable } from '@nestjs/common';
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

  async findById(id: number): Promise<Profile | null> {
    return this.profilesRepository.findById(id);
  }

  async updateProfile(id: number, updateProfileDto: Partial<Profile>): Promise<Profile | null> {
    return this.profilesRepository.updateProfile(id, updateProfileDto);
  }

  async deleteProfile(id: number): Promise<Profile | null> {
    return this.profilesRepository.deleteProfile(id);
  }
}