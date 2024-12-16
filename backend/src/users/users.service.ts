import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserData } from './types/user.type';
import { Role } from 'src/enums/role.enum';
import { userData } from './dto/user.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly mailerService: MailerService,
  ) {}

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

    const registeredUserData =
      await this.usersRepository.create(registerUserData);

    this.mailerService.sendMail({
      to: `${registeredUserData.email}`,
      from: `"Adminisjtracja serwisu" <kacper4312@op.pl>`,
      subject: 'Potwierdzenie utworzenia konta',
      text: `Witaj, ${registerData.email} \n Kliknij w link, aby aktywować konto: http://localhost:5173/activate-account/${registerData.email}`,
      html: `Witaj, ${registerData.email} \n Kliknij w link, aby aktywować konto: <a href="http://localhost:5173/activate-account/${registerData.email}"> LINK </a>`,
    });

    console.log('zarejestrowano');

    return registeredUserData;
  }

  async loginUser(loginData: Partial<UserData>): Promise<User | null> {
    const someUser = await this.usersRepository.findActivateAccountByEmail(
      loginData.email,
    );

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

  async activateAccount(userEmail: string): Promise<User> {
    const someUser = await this.usersRepository.findByEmail(userEmail);

    if (!someUser) {
      throw new BadRequestException('invalid-user-data');
    }

    someUser.isActivated = true;

    return await this.usersRepository.update(someUser.id, someUser);
  }
}
