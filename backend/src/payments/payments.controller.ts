import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payments.service';
import { Payment } from './entities/payment.entity';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(@Body() createPaymentDto: Partial<Payment>): Promise<Payment> {
    try {
      return await this.paymentService.createPayment(createPaymentDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(): Promise<Payment[]> {
    return await this.paymentService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Payment> {
    const payment = await this.paymentService.findById(id);
    if (!payment) {
      throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
    }
    return payment;
  }

  @Put(':id')
  async updatePayment(
    @Param('id') id: string,
    @Body() updatePaymentDto: Partial<Payment>,
  ): Promise<Payment> {
    try {
      const updatedPayment = await this.paymentService.updatePayment(id, updatePaymentDto);
      if (!updatedPayment) {
        throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
      }
      return updatedPayment;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async deletePayment(@Param('id') id: string): Promise<Payment> {
    const deletedPayment = await this.paymentService.deletePayment(id);
    if (!deletedPayment) {
      throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
    }
    return deletedPayment;
  }
}