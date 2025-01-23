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
import { PaymentsService } from './payments.service';
import { Payment } from './entities/payment.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiBearerAuth('access-token')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
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

  @Get('all-payments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findAll(@Res() response: Response) {
    const payments = await this.paymentsService.findAll();

    response.status(HttpStatus.OK).send({
      message: 'all-payments',
      data: payments,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
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
