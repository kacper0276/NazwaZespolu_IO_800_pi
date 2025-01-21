import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentRepository } from './payments.repository';
import { Payment, PaymentSchema } from './entities/payment.entity';
import { mailerConfig } from 'src/config/mailer.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { Profile, ProfileSchema } from 'src/profiles/entities/profile.entity';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { ProfilesModule } from 'src/profiles/profiles.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: User.name, schema: UserSchema },
    ]),
    MailerModule.forRoot(mailerConfig),
    UsersModule,
    ProfilesModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentRepository],
})
export class PaymentsModule {}
