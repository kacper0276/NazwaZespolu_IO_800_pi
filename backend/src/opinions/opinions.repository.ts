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

  async getAllActiveOpinions(): Promise<Opinion[]> {
    return this.opinionModel
      .aggregate([
        {
          $match: { closed: false },
        },
        {
          $addFields: {
            rolePriority: {
              $switch: {
                branches: [
                  { case: { $eq: ['$user.role', 'admin'] }, then: 1 },
                  { case: { $eq: ['$user.role', 'moderator'] }, then: 2 },
                  { case: { $eq: ['$user.role', 'user'] }, then: 3 },
                ],
                default: 4,
              },
            },
          },
        },
        {
          $sort: { rolePriority: 1 },
        },
        {
          $project: { rolePriority: 0 },
        },
      ])
      .exec();
  }
}
