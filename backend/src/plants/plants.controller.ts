import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PlantsService } from './plants.service';
import { Plant } from './entities/plant.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiBearerAuth('access-token')
@Controller('plants')
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPlant(
    @Body() createPlantDto: Partial<Plant>,
    @Res() response: Response,
  ) {
    try {
      const plant = await this.plantsService.createPlant(
        createPlantDto,
      );

      response.status(HttpStatus.OK).send({
        message: 'create-plant',
        data: plant,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('all-plants')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findAll(@Res() response: Response) {
    const plants = await this.plantsService.findAll();

    response.status(HttpStatus.OK).send({
      message: 'all-plants',
      data: plants,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: number, @Res() response: Response) {
    const plant = await this.plantsService.findById(id);
    if (!plant) {
      throw new HttpException('Plant not found', HttpStatus.NOT_FOUND);
    }

    response.status(HttpStatus.OK).send({
      message: 'plant-data',
      data: plant,
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updatePlant(
    @Param('id') id: number,
    @Body() updatePlantDto: Partial<Plant>,
    @Res() response: Response,
  ) {
    try {
      const updatedPlant = await this.plantsService.updatePlant(
        id,
        updatePlantDto,
      );
      if (!updatedPlant) {
        throw new HttpException('Plant not found', HttpStatus.NOT_FOUND);
      }
      
      response.status(HttpStatus.OK).send({
        message: 'update-plant',
        data: updatedPlant,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePlant(@Param('id') id: number, @Res() response: Response) {
    const deletedPlant = await this.plantsService.deletePlant(id);
    if (!deletedPlant) {
      throw new HttpException('Plant not found', HttpStatus.NOT_FOUND);
    }

    response.status(HttpStatus.OK).send({
      message: 'remove-plant',
      data: deletedPlant,
    });
  }
}
