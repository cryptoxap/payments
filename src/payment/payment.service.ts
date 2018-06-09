import { Injectable, HttpService, Inject } from '@nestjs/common';
import * as RedSys from 'redsys-pos';
const { CURRENCIES, TRANSACTION_TYPES } = RedSys;

@Injectable()
export class PaymentService {

  _redsys;

  constructor(
    @Inject('ConfigService') private readonly config
  ){
    this._redsys = new RedSys(this.config.merchantKey);
  }

  async payment(pay) {

    let params = {
      amount: pay.amount, // cents (in euro)
      orderReference: Math.floor(Math.pow(10, 11-1) + Math.random() * 9 * Math.pow(10, 11-1)).toString(),
      merchantName:this.config.merchantName,
      merchantCode: this.config.merchantCode,
      currency: CURRENCIES.EUR,
      transactionType: TRANSACTION_TYPES.AUTHORIZATION, // '0'
      terminal: '1',
      merchantURL: this.config.merchantURL,
      successURL: this.config.paymentSuccessURL,
      errorURL: this.config.paymentErrorURL
    }

    return this._redsys.makePaymentParameters(params)
  }
}
