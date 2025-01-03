import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Opinion, OpinionDocument } from './entities/opinions.entity';
import { Model } from 'mongoose';

@Injectable()
export class OpinionsRepository {
  constructor(
    @InjectModel(Opinion.name)
    private readonly opinionModel: Model<OpinionDocument>,
  ) {}

  async create(opinion: Partial<Opinion>): Promise<Opinion> {
    const newOpinion = new this.opinionModel(opinion);

    return newOpinion.save();
  }

  async delete(id: string): Promise<Opinion | null> {
    return this.opinionModel.findByIdAndDelete(id).exec();
  }

  async update(id: string, updates: Partial<Opinion>): Promise<Opinion | null> {
    return this.opinionModel
      .findByIdAndUpdate(id, updates, { new: true })
      .exec();
  }

  async findAll(): Promise<Opinion[]> {
    return this.opinionModel.find().exec();
  }
}
