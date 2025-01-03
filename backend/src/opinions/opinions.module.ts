import { Module } from '@nestjs/common';
import { OpinionsService } from './opinions.service';
import { OpinionsController } from './opinions.controller';
import { OpinionsRepository } from './opinions.repository';
import { Opinion, OpinionSchema } from './entities/opinions.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Opinion.name, schema: OpinionSchema }]),
  ],
  providers: [OpinionsService, OpinionsRepository],
  controllers: [OpinionsController],
})
export class OpinionsModule {}
