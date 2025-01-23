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
    <!doctype html>
    <html lang="pl">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Potwierdzenie płatności</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #333;
          }

          .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
          }

          .email-header {
            background: linear-gradient(90deg, #45c032, #00957f);
            color: #ffffff;
            text-align: center;
            padding: 20px;
            font-size: 24px;
          }

          .email-body {
            padding: 20px;
          }

          .email-body p {
            margin: 0 0 15px;
            line-height: 1.6;
          }

          .details {
            margin-top: 20px;
            padding: 15px;
            background-color: #f1f1f1;
            border-radius: 8px;
            border: 1px solid #ddd;
          }

          .details p {
            margin: 8px 0;
          }

          .cta {
            display: inline-block;
            background: linear-gradient(90deg, #45c032, #00957f);
            color: #ffffff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            font-size: 16px;
            margin-top: 20px;
            transition: background 0.3s ease, transform 0.3s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: center;
          }

          .email-footer {
            background-color: #f1f1f1;
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            Potwierdzenie Płatności
          </div>
          <div class="email-body">
            <p>Witaj, ${email}</p>
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
            <a href="mailto:support@example.com" class="cta">Skontaktuj się z nami</a>
          </div>
          <div class="email-footer">
            &copy; 2024 TheForest. Wszelkie prawa zastrzeżone.
          </div>
        </div>
      </body>
    </html>
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
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
        color: #333;
      }

      .email-container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
      }

      .email-container:hover {
        transform: scale(1.02);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      .email-header {
        background: linear-gradient(90deg, #45c032, #00957f);
        color: #ffffff;
        text-align: center;
        padding: 20px;
        font-size: 24px;
      }

      .email-body {
        padding: 20px;
      }

      .email-body p {
        margin: 0 0 15px;
        line-height: 1.6;
      }

      .details {
        margin-top: 20px;
        padding: 15px;
        background-color: #f1f1f1;
        border-radius: 8px;
        border: 1px solid #ddd;
      }

      .details p {
        margin: 8px 0;
      }

      .email-body .cta {
        display: inline-block;
        background: linear-gradient(90deg, #45c032, #00957f);
        color: #ffffff;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 4px;
        font-size: 16px;
        margin-top: 20px;
        transition: background 0.3s ease, transform 0.3s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        text-align: center;
      }

      .email-body .cta:hover {
        background: linear-gradient(90deg, #00957f, #45c032);
        transform: translateY(-3px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
      }

      .email-footer {
        background-color: #f1f1f1;
        text-align: center;
        padding: 10px;
        font-size: 12px;
        color: #666;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        Potwierdzenie Płatności
      </div>
      <div class="email-body">
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
        <a href="mailto:support@example.com" class="cta">Skontaktuj się z nami</a>
      </div>
      <div class="email-footer">
        &copy; 2024 TheForest. Wszelkie prawa zastrzeżone.
      </div>
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
