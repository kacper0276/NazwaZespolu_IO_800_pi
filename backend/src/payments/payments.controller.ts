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
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Payment } from './entities/payment.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';

@ApiBearerAuth('access-token')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async createPayment(
    @Body() createPaymentDto: Partial<Payment>,
    @Res() response: Response,
  ) {
    try {
      const payment =
        await this.paymentsService.createPayment(createPaymentDto);

      response.status(HttpStatus.CREATED).send({
        message: 'send-payment-details-on-email',
        data: payment,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(@Res() response: Response) {
    const payments = await this.paymentsService.findAll();

    response.status(HttpStatus.OK).send({
      message: 'all-payments',
      data: payments,
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Res() response: Response) {
    const payment = await this.paymentsService.findAll();
    if (!payment) {
      throw new HttpException('payment-not-found', HttpStatus.NOT_FOUND);
    }

    response.status(HttpStatus.OK).send({
      message: 'payment-data',
      data: payment,
    });
  }

  @Put(':id')
  async updatePayment(
    @Param('id') id: string,
    @Body() updatePaymentDto: Partial<Payment>,
    @Res() response: Response,
  ) {
    try {
      const updatedPayment = await this.paymentsService.updatePayment(
        id,
        updatePaymentDto,
      );
      if (!updatedPayment) {
        throw new HttpException('payment-not-found', HttpStatus.NOT_FOUND);
      }

      response.status(HttpStatus.OK).send({
        message: 'update-payment',
        data: updatedPayment,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async deletePayment(@Param('id') id: string, @Res() response: Response) {
    const deletedPayment = await this.paymentsService.deletePayment(id);
    if (!deletedPayment) {
      throw new HttpException('payment-not-found', HttpStatus.NOT_FOUND);
    }

    response.status(HttpStatus.OK).send({
      message: 'remove-payment',
      data: deletedPayment,
    });
  }
}
