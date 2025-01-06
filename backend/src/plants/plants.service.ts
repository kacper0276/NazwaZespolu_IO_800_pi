import { Injectable } from '@nestjs/common';
import { PlantsRepository } from './plants.repository';
import { Plant } from './entities/plant.entity';

@Injectable()
export class PlantsService {
  constructor(private readonly plantsRepository: PlantsRepository) {}

  async createPlant(createPlantDto: any): Promise<Plant> {
    return this.plantsRepository.createPlant(createPlantDto);
  }

  async findAll(): Promise<Plant[]> {
    return this.plantsRepository.findAll();
  }

  async findById(id: number): Promise<Plant> {
    return this.plantsRepository.findById(id);
  }

  async updatePlant(id: number, updatePlantDto: any): Promise<Plant> {
    return this.plantsRepository.updatePlant(id, updatePlantDto);
  }

  async deletePlant(id: number): Promise<Plant> {
    return this.plantsRepository.deletePlant(id);
  }
}

