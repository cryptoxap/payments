import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/common/http';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [HttpModule],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule {}
