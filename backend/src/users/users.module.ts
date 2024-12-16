import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { mailerConfig } from 'src/config/mailer.config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MailerModule.forRoot(mailerConfig),
  ],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
})
export class UsersModule {}
