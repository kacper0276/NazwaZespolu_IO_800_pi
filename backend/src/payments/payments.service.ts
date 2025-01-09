import { Injectable } from '@nestjs/common';
import { PaymentRepository } from './payments.repository';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(private readonly paymentsRepository: PaymentRepository) {}

  async createPayment(createPaymentDto: Partial<Payment>): Promise<Payment> {
    return this.paymentsRepository.createPayment(createPaymentDto);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentsRepository.findAll();
  }

  async findById(id: string): Promise<Payment | null> {
    return this.paymentsRepository.findById(id);
  }

  async updatePayment(id: string, updatePaymentDto: Partial<Payment>): Promise<Payment | null> {
    return this.paymentsRepository.updatePayment(id, updatePaymentDto);
  }

  async deletePayment(id: string): Promise<Payment | null> {
    return this.paymentsRepository.deletePayment(id);
  }
}
