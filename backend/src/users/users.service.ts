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
    const emailTemplate = `
    <!DOCTYPE html>
    <html lang="pl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Potwierdzenie rejestracji</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f9f9f9;
                color: #333;
            }

            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s ease;
            }

            .email-container:hover {
                transform: scale(1.02);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }

            .email-header {
                background: linear-gradient(90deg, #45c032, #00957f);
                color: #ffffff;
                text-align: center;
                padding: 20px;
                font-size: 24px;
            }

            .email-body {
                padding: 20px;
            }

            .email-body p {
                margin: 0 0 15px;
                line-height: 1.6;
            }

            .email-body a {
                display: inline-block;
                background: linear-gradient(90deg, #45c032, #00957f);
                color: #ffffff;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 4px;
                font-size: 16px;
                margin-top: 10px;
                transition: background 0.3s ease, transform 0.3s ease;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .email-body a:hover {
                background: linear-gradient(90deg, #00957f, #45c032);
                transform: translateY(-3px);
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
            }

            .email-footer {
                background-color: #f1f1f1;
                text-align: center;
                padding: 10px;
                font-size: 12px;
                color: #666;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="email-header">
                Potwierdzenie rejestracji
            </div>
            <div class="email-body">
                <p>Witaj, </p>
                <p>Dziękujemy za rejestrację na naszej platformie. Aby aktywować swoje konto, kliknij poniższy przycisk:</p>
                <p>
                    <a href="${activationLink}" target="_blank">Aktywuj konto</a>
                </p>
                <p>Jeśli nie rejestrowałeś/aś się w naszym serwisie, zignoruj tę wiadomość.</p>
            </div>
            <div class="email-footer">
                &copy; 2024 TheForest. Wszelkie prawa zastrzeżone.
            </div>
        </div>
    </body>
    </html>
    `;

    const message = {
      to: email,
      from: `"Administracja serwisu" <kacper4312@op.pl>`,
      subject: 'Potwierdzenie utworzenia konta',
      html: emailTemplate,
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

  async getUserById(userId: string): Promise<User> {
    return this.usersRepository.findById(userId);
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
