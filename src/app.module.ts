import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
  MailerModule.forRoot({
    transport: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    },
    defaults: {
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM}>`,
    }
  }),
    ContactModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
