import { Controller, Post, Get, Body, Render, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {

  constructor(
    private readonly paymentService: PaymentService
  ){}

  @Post('payment')
  async payment(@Body() body){
    return this.paymentService.payment(body)
  }

  @Get('result')
  @Render('result')
  result(
    @Query('Ds_MerchantParameters') merchantParams,
    @Query('Ds_Signature') signature 
  ){
    return { message: this.paymentService.checkResponse(merchantParams, signature) };
  }
}
