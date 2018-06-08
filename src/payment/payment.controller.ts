import { Controller, Post, Body } from '@nestjs/common';

@Controller('payment')
export class PaymentController {

  @Post()
  async payment(@Body() body){
    return body
  }

}
