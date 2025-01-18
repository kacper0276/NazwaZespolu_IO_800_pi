import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { MessagesModule } from './messages/messages.module';
import { AuthModule } from './auth/auth.module';
import { SettingsModule } from './settings/settings.module';
import { OpinionsModule } from './opinions/opinions.module';
import { ProfilesModule } from './profiles/profiles.module';
import { GoalsModule } from './goals/goals.module';
import { PaymentsModule } from './payments/payments.module';
import { PlantsModule } from './plants/plants.module';
import { CommentsModule } from './comments/comments.module';
import { GoalUpdateModule } from './goalupdates/goalupdates.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URI,
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASSWORD,
        dbName: process.env.MONGO_DATABASE,
      }),
    }),
    UsersModule,
    MessagesModule,
    AuthModule,
    SettingsModule,
    OpinionsModule,
    ProfilesModule,
    GoalsModule,
    ProfilesModule,
    PaymentsModule,
    PlantsModule,
    CommentsModule,
    GoalUpdateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
