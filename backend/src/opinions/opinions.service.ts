import { Injectable, Logger } from '@nestjs/common';
import { OpinionsRepository } from './opinions.repository';

@Injectable()
export class OpinionsService {
  private readonly logger = new Logger(OpinionsService.name);

  constructor(private readonly opinionRepository: OpinionsRepository) {}
}
