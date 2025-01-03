import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { Profile, ProfileSchema } from './entities/profiles.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfilesRepository } from './profiles.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
  ],
  controllers: [ProfilesController, ProfilesRepository],
  providers: [ProfilesService],
})
export class ProfilesModule {}
