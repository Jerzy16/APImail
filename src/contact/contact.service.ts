import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly mailerService: MailerService) { }

  async sendContactEmail(contactDto: ContactDto): Promise<{ message: string }> {
    const { name, email, subject, message } = contactDto;

    try {
      await this.mailerService.sendMail({
        to: process.env.CONTACT_EMAIL,
        from: process.env.SMTP_FROM,
        subject: `Nuevo mensaje de contacto: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Nuevo mensaje de contacto</h2>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
              <p><strong>Nombre:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Asunto:</strong> ${subject}</p>
              <hr style="border: 1px solid #ddd;">
              <p><strong>Mensaje:</strong></p>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              Este mensaje fue enviado desde el formulario de contacto de tu sitio web.
            </p>
          </div>
        `,
        replyTo: email,
      });

      return { message: 'Mensaje enviado exitosamente' };
    } catch (error) {
      console.error('Error al enviar el email:', error);
      throw new InternalServerErrorException(
        'Error al enviar el mensaje. Por favor, intenta nuevamente.' + {
          SMTP_HOST: process.env.SMTP_HOST,
          SMTP_PORT: process.env.SMTP_PORT,
          SMTP_USER: process.env.SMTP_USER,
          NODE_ENV: process.env.NODE_ENV,
        },
      );
    }
  }
}
