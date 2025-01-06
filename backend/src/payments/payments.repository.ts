import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './entities/payment.entity';
import { Model } from 'mongoose';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: Model<PaymentDocument>,
  ) {}

  async createPayment(payment: Partial<Payment>): Promise<Payment> {
    const newPayment = new this.paymentModel(payment);
    return newPayment.save();
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentModel.find().exec();
  }

  async findById(id: string): Promise<Payment | null> {
    return this.paymentModel.findById(id).exec();
  }

  async updatePayment(id: string, updateData: Partial<Payment>): Promise<Payment | null> {
    return this.paymentModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async deletePayment(id: string): Promise<Payment | null> {
    return this.paymentModel.findByIdAndDelete(id).exec();
  }
}