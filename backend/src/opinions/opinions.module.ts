import { Module } from '@nestjs/common';
import { OpinionsService } from './opinions.service';
import { OpinionsController } from './opinions.controller';

@Module({
  providers: [OpinionsService],
  controllers: [OpinionsController]
})
export class OpinionsModule {}
