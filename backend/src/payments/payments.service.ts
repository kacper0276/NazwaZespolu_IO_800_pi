import { Injectable } from '@nestjs/common';
import { PaymentRepository } from './payments.repository';
import { Payment } from './entities/payment.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from 'src/users/users.service';
import { ProfilesService } from 'src/profiles/profiles.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentsRepository: PaymentRepository,
    private readonly mailerService: MailerService,
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
  ) {}

  private generatePaymentString(): string {
    const currentYear = new Date().getFullYear();
    const randomDigits = Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * 10),
    ).join('');
    return `Pay/${currentYear}/${randomDigits}`;
  }

  private async sendMailWithPaymentDetails(email: string): Promise<void> {
    const message = {
      to: email,
      from: `"Adminisjtracja serwisu" <kacper4312@op.pl>`,
      subject: 'Potwierdzenie płatności',
      text: `Witaj, ${email} \n Poniżej przesyłam pdf ze szczegółami zakupu`,
      html: `Witaj, ${email} \n Poniżej przesyłam pdf ze szczegółami zakupu`,
    };

    await this.mailerService.sendMail(message);
  }

  async createPayment(createPaymentDto: Partial<Payment>): Promise<Payment> {
    createPaymentDto.paymentNumber = this.generatePaymentString();

    const profile = await this.profilesService.findById(
      createPaymentDto.profileId,
    );

    const user = await this.usersService.getUserById(String(profile.userId));

    await this.sendMailWithPaymentDetails(user.email);

    return this.paymentsRepository.createPayment(createPaymentDto);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentsRepository.findAll();
  }

  async findById(id: string): Promise<Payment | null> {
    return this.paymentsRepository.findById(id);
  }

  async updatePayment(
    id: string,
    updatePaymentDto: Partial<Payment>,
  ): Promise<Payment | null> {
    return this.paymentsRepository.updatePayment(id, updatePaymentDto);
  }

  async deletePayment(id: string): Promise<Payment | null> {
    return this.paymentsRepository.deletePayment(id);
  }
}
