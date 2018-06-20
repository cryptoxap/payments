import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/common/http';
import { stringify } from 'querystring'
import * as RedSys from 'redsys-pos';
const { CURRENCIES, TRANSACTION_TYPES } = RedSys;

@Injectable()
export class PaymentService {

  _redsys;

  constructor(
    private readonly httpService: HttpService,
    @Inject('ConfigService') private readonly config
  ){
    this._redsys = new RedSys(this.config.merchantKey);
  }

  payment(pay) {
    return new Promise((resolve, reject) => {

      if (!pay['g-recaptcha-response']) {
        return reject(new BadRequestException('Solicitud inválida'))
      }
  
      return this.httpService.post('https://www.google.com/recaptcha/api/siteverify',
        stringify({
          secret: this.config.recaptcha_secret,
          response: pay['g-recaptcha-response'],
        }),{
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      )
      .toPromise()
      .then((response) => {
        if (response.data.success == true) {
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
          try {
            const paymentRequest = this._redsys.makePaymentParameters(params)
            paymentRequest.env = this.config.environment;
            resolve(paymentRequest) 
          } catch (err) {
            reject(new BadRequestException(err.toString()))
          }
        } else {
          reject(new BadRequestException('Invalid Captcha'))
        }
      })
      .catch(err => {
        reject(new BadRequestException(err.toString()))
      })
    })
  }
}