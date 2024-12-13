import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    return this.usersRepository.update(id, updates);
  }

  async deleteUser(id: string): Promise<User | null> {
    return this.usersRepository.delete(id);
  }

  async registerUser(user: Partial<User>): Promise<User | null> {
    return this.usersRepository.create(user);
  }
}
