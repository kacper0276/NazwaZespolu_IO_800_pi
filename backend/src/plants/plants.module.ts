import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlantsController } from './plants.controller';
import { PlantsService } from './plants.service';
import { PlantsRepository } from './plants.repository';
import { Plant, PlantSchema } from './entities/plant.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Plant.name, schema: PlantSchema }]),
  ],
  controllers: [PlantsController],
  providers: [PlantsService, PlantsRepository],
})
export class PlantsModule {}