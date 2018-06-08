import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from './config/config.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule,
    PaymentModule
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
