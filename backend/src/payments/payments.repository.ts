import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './entities/payment.entity';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from 'src/profiles/entities/profile.entity';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
  ) {}

  async createPayment(payment: Partial<Payment>): Promise<Payment> {
    const newPayment = new this.paymentModel(payment);

    const profile = await this.profileModel.findById(payment.profileId);

    if (!profile) return;

    profile.premium = true;
    profile.save();

    return newPayment.save();
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentModel.find().exec();
  }

  async findById(id: string): Promise<Payment | null> {
    return this.paymentModel.findById(id).exec();
  }

  async updatePayment(
    id: string,
    updateData: Partial<Payment>,
  ): Promise<Payment | null> {
    return this.paymentModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async deletePayment(id: string): Promise<Payment | null> {
    return this.paymentModel.findByIdAndDelete(id).exec();
  }
}
