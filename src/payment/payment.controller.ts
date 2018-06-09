import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {

  constructor(
    private readonly paymentService: PaymentService
  ){}

  @Post()
  async payment(@Body() body){
    return this.paymentService.payment(body)
  }

}
