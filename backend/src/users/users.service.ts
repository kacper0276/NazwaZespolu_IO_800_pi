import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserData } from './types/user.type';
import { Role } from 'src/enums/role.enum';
import { userData } from './dto/user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly mailerService: MailerService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private async sendActivationEmail(email: string): Promise<void> {
    const activationLink = `http://localhost:5173/activate-account/${email}`;
    const message = {
      to: email,
      from: `"Adminisjtracja serwisu" <kacper4312@op.pl>`,
      subject: 'Potwierdzenie utworzenia konta',
      text: `Witaj, ${email} \n Kliknij w link, aby aktywować konto: ${activationLink}`,
      html: `Witaj, ${email} \n Kliknij w link, aby aktywować konto: <a href="${activationLink}">LINK</a>`,
    };

    await this.mailerService.sendMail(message);
  }

  private async deleteFile(filePath: string): Promise<void> {
    try {
      const fullPath = path.join(__dirname, '../frontend/public', filePath);
      await fs.unlink(fullPath);
    } catch (error) {
      console.error(`Error deleting file: ${filePath}`, error.message);
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (updates.profileImage && user.profileImage) {
      await this.deleteFile(user.profileImage);
    }

    if (updates.backgroundImage && user.backgroundImage) {
      await this.deleteFile(user.backgroundImage);
    }

    const updatedPassword = updates.password
      ? await this.hashPassword(updates.password)
      : user.password;

    const userUpdates = {
      ...updates,
      password: updatedPassword,
      profileImage: updates.profileImage || user.profileImage,
      backgroundImage: updates.backgroundImage || user.backgroundImage,
    };

    const updatedUser = await this.usersRepository.update(id, userUpdates);

    if (updates.email && updates.email !== user.email) {
      await this.sendActivationEmail(updatedUser.email);
    }

    return updatedUser;
  }

  async deleteUser(id: string): Promise<User | null> {
    return this.usersRepository.delete(id);
  }

  async registerUser(registerData: Partial<UserData>): Promise<User | null> {
    if (registerData.password !== registerData.repeat_password) {
      throw new BadRequestException('passwords-do-not-match');
    }

    const existingUser = await this.usersRepository.findByEmail(
      registerData.email,
    );
    if (existingUser) {
      throw new BadRequestException('a-user-with-this-email-already-exists');
    }

    const hashedPassword = await this.hashPassword(registerData.password);

    const newUser: userData = {
      email: registerData.email,
      password: hashedPassword,
      role: Role.USER,
      isActivated: false,
      firstname: registerData.firstname,
      lastname: registerData.lastname,
    };

    const registeredUser = await this.usersRepository.create(newUser);

    await this.sendActivationEmail(registeredUser.email);

    return registeredUser;
  }

  async loginUser(loginData: Partial<UserData>): Promise<User | null> {
    const user = await this.usersRepository.findActivateAccountByEmail(
      loginData.email,
    );

    if (!user) {
      throw new BadRequestException('invalid-user-data');
    }

    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('invalid-user-data');
    }

    return user;
  }

  async activateAccount(userEmail: string): Promise<User> {
    const user =
      await this.usersRepository.activateAccountAndCreateProfile(userEmail);

    if (!user) {
      throw new BadRequestException('invalid-user-data');
    }

    return user;
  }

  async searchUsers(query: string): Promise<User[]> {
    if (!query) {
      throw new BadRequestException('search-query-cannot-be-empty');
    }

    return this.usersRepository.searchUsersByQuery(query);
  }

  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDeleteInactiveUsers() {
    this.logger.log(
      'Rozpoczynanie zadania cron: usuwanie nieaktywnych użytkowników.',
    );

    const deletedCount = await this.usersRepository.deleteInactiveUsers();
    this.logger.log(`Usunięto ${deletedCount} nieaktywnych użytkowników.`);
  }
}
