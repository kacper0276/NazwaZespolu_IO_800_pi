import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserData } from './types/user.type';
import { Role } from 'src/enums/role.enum';
import { userData } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    return this.usersRepository.update(id, updates);
  }

  async deleteUser(id: string): Promise<User | null> {
    return this.usersRepository.delete(id);
  }

  async registerUser(registerData: Partial<UserData>): Promise<User | null> {
    const saltOrRounds = 10;

    const someUser = await this.usersRepository.findByEmail(registerData.email);

    if (registerData.password !== registerData.repeat_password) {
      throw new BadRequestException('passwords-do-not-match');
    }

    if (someUser) {
      throw new BadRequestException('a-user-with-this-email-already-exists');
    }

    const hash = await bcrypt.hashSync(registerData.password, saltOrRounds);

    const registerUserData: userData = {
      email: registerData.email,
      password: hash,
      role: Role.USER,
      isActivated: false,
    };

    return this.usersRepository.create(registerUserData);
  }

  async loginUser(loginData: Partial<UserData>): Promise<User | null> {
    const someUser = await this.usersRepository.findByEmail(loginData.email);

    if (someUser) {
      const comparePassword = await bcrypt.compare(
        loginData.password,
        someUser.password,
      );

      if (comparePassword) {
        return someUser;
      }

      throw new BadRequestException('invalid-user-data');
    }

    throw new BadRequestException('invalid-user-data');
  }
}
