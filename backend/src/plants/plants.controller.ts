import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { Plant } from './entities/plant.entity';

@Controller('plants')
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  @Post()
  async createPlant(@Body() createPlantDto: any): Promise<Plant> {
    try {
      return await this.plantsService.createPlant(createPlantDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(): Promise<Plant[]> {
    return await this.plantsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Plant> {
    const plant = await this.plantsService.findById(id);
    if (!plant) {
      throw new HttpException('Plant not found', HttpStatus.NOT_FOUND);
    }
    return plant;
  }

  @Put(':id')
  async updatePlant(
    @Param('id') id: number,
    @Body() updatePlantDto: any,
  ): Promise<Plant> {
    try {
      const updatedPlant = await this.plantsService.updatePlant(id, updatePlantDto);
      if (!updatedPlant) {
        throw new HttpException('Plant not found', HttpStatus.NOT_FOUND);
      }
      return updatedPlant;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async deletePlant(@Param('id') id: number): Promise<Plant> {
    const deletedPlant = await this.plantsService.deletePlant(id);
    if (!deletedPlant) {
      throw new HttpException('Plant not found', HttpStatus.NOT_FOUND);
    }
    return deletedPlant;
  }
}