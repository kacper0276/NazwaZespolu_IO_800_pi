import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OpinionsRepository } from './opinions.repository';
import { Opinion } from './entities/opinions.entity';

@Injectable()
export class OpinionsService {
  private readonly logger = new Logger(OpinionsService.name);

  constructor(private readonly opinionRepository: OpinionsRepository) {}

  async create(opinion: Partial<Opinion>): Promise<Opinion> {
    try {
      opinion.closed = false;
      return await this.opinionRepository.create(opinion);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<Opinion | null> {
    const deletedOpinion = await this.opinionRepository.delete(id);
    if (!deletedOpinion) {
      throw new NotFoundException(`Opinion with id: ${id} not found`);
    }
    return deletedOpinion;
  }

  async update(id: string, updates: Partial<Opinion>): Promise<Opinion | null> {
    const updatedOpinion = await this.opinionRepository.update(id, updates);
    if (!updatedOpinion) {
      throw new NotFoundException(`Opinion with id: ${id} not found`);
    }
    return updatedOpinion;
  }

  async findAll(): Promise<Opinion[]> {
    return await this.opinionRepository.findAll();
  }

  async getAllActiveOpinions(): Promise<Opinion[]> {
    return await this.opinionRepository.getAllActiveOpinions();
  }
}
