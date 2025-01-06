import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Plant, PlantDocument } from './entities/plant.entity';
import { Model } from 'mongoose';

@Injectable()
export class PlantsRepository {
  constructor(
    @InjectModel(Plant.name) private readonly plantModel: Model<PlantDocument>,
  ) {}

  async createPlant(plant: Partial<Plant>): Promise<Plant> {
    const newPlant = new this.plantModel(plant);
    return newPlant.save();
  }

  async findAll(): Promise<Plant[]> {
    return this.plantModel.find().exec();
  }

  async findById(id: number): Promise<Plant | null> {
    return this.plantModel.findOne({ id }).exec();
  }

  async updatePlant(id: number, updateData: Partial<Plant>): Promise<Plant | null> {
    return this.plantModel.findOneAndUpdate({ id }, updateData, { new: true }).exec();
  }

  async deletePlant(id: number): Promise<Plant | null> {
    return this.plantModel.findOneAndDelete({ id }).exec();
  }
}