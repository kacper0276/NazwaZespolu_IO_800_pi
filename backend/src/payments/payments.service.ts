import { Injectable } from '@nestjs/common';
import { PaymentRepository } from './payments.repository';
import { Payment } from './entities/payment.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from 'src/users/users.service';
import { ProfilesService } from 'src/profiles/profiles.service';
import * as puppeteer from 'puppeteer';

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

  private async renderEmailTemplate(
    payment: Payment,
    email: string,
  ): Promise<string> {
    return `
    <p>Witaj, ${email}</p>
    <p>Dziękujemy za dokonanie płatności. Szczegóły transakcji:</p>
    <ul>
      <li>Numer płatności: ${payment.paymentNumber}</li>
      <li>Metoda płatności: ${payment.paymentMethod}</li>
      <li>Status płatności: ${payment.paymentStatus}</li>
      <li>Kwota: ${payment.amount} $</li>
    </ul>
    <p>Pozdrawiamy,<br>Zespół Administracji Serwisu</p>
  `;
  }

  private async sendMailWithPaymentDetails(
    email: string,
    payment: Payment,
    name: string,
  ): Promise<void> {
    const pdfBuffer = await this.generatePDF(payment, name);

    const message = {
      to: email,
      from: `"Adminisjtracja serwisu" <kacper4312@op.pl>`,
      subject: 'Potwierdzenie płatności',
      html: await this.renderEmailTemplate(payment, email),
      attachments: [
        {
          filename: `Potwierdzenie_Platnosci_${payment.paymentNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    };

    await this.mailerService.sendMail(message);
  }

  private async generatePDF(payment: Payment, name: string): Promise<Buffer> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const htmlTemplate = `
    <!doctype html>
    <html lang="pl">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Potwierdzenie płatności</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            max-width: 600px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .header h1 {
            color: #007bff;
          }
          .details {
            margin-top: 20px;
          }
          .details p {
            margin: 8px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Potwierdzenie Płatności</h1>
          </div>
          <p>Witaj, ${name}</p>
          <p>
            Dziękujemy za dokonanie płatności. Poniżej znajdziesz szczegóły
            transakcji:
          </p>
          <div class="details">
            <p><strong>Numer płatności:</strong> ${payment.paymentNumber}</p>
            <p><strong>Metoda płatności:</strong> ${payment.paymentMethod}</p>
            <p><strong>Status płatności:</strong> ${payment.paymentStatus}</p>
            <p><strong>Kwota:</strong> ${payment.amount} $</p>
          </div>
          <p>Jeśli masz jakiekolwiek pytania, skontaktuj się z nami.</p>
          <p>Pozdrawiamy,<br />Zespół Administracji Serwisu</p>
        </div>
      </body>
    </html>
  `;

    await page.setContent(htmlTemplate, { waitUntil: 'load' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    return Buffer.from(pdfBuffer);
  }

  async createPayment(createPaymentDto: Partial<Payment>): Promise<Payment> {
    createPaymentDto.paymentNumber = this.generatePaymentString();

    const profile = await this.profilesService.findById(
      createPaymentDto.profileId,
    );

    const user = await this.usersService.getUserById(String(profile.userId));

    const payment =
      await this.paymentsRepository.createPayment(createPaymentDto);

    await this.sendMailWithPaymentDetails(
      user.email,
      payment,
      `${user.firstname} ${user.lastname}`,
    );

    return payment;
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
