import { Injectable } from '@nestjs/common';
import { PaymentRepository } from './payments.repository';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async createPayment(createPaymentDto: Partial<Payment>): Promise<Payment> {
    return this.paymentRepository.createPayment(createPaymentDto);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.findAll();
  }

  async findById(id: string): Promise<Payment | null> {
    return this.paymentRepository.findById(id);
  }

  async updatePayment(id: string, updatePaymentDto: Partial<Payment>): Promise<Payment | null> {
    return this.paymentRepository.updatePayment(id, updatePaymentDto);
  }

  async deletePayment(id: string): Promise<Payment | null> {
    return this.paymentRepository.deletePayment(id);
  }
}
