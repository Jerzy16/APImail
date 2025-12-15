import { Module, Global } from '@nestjs/common';
import { Resend } from 'resend';

@Global()
@Module({
  providers: [
    {
      provide: 'RESEND',
      useFactory: () => {
        return new Resend(process.env.RESEND_API_KEY);
      },
    },
  ],
  exports: ['RESEND'],
})
export class ResendModule {}
