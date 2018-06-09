import { parse } from 'dotenv';
import * as Joi from 'joi';
import { existsSync, readFileSync } from 'fs';
import { Logger } from '@nestjs/common';

interface EnvConfig {
  [prop: string]: string;
}

export class ConfigService {
  private readonly envConfig: EnvConfig;
  private readonly filePath = `.env.${process.env.NODE_ENV || 'development'}`;
  private logger = new Logger(`ConfigService`, true)

  constructor() {
    if (!existsSync(this.filePath)) {
      this.logger.error(`Config file ${this.filePath} not exist`)
      throw new Error();
    }
    const config = parse(readFileSync(this.filePath, 'utf-8'));
    this.envConfig = this.validateInput(config);
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      PORT: Joi.number().default(3000),
      MERCHANT_KEY: Joi.string(),
      MERCHANT_URL: Joi.string(),
      PAYMENT_SUCCESS_URL: Joi.string(),
      PAYMENT_ERROR_URL: Joi.string(),
      MERCHANT_NAME: Joi.string(),
      MERCHANT_CODE: Joi.number()
    });

    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      envVarsSchema,
    );
    if (error) {
      this.logger.error(`Config validation error: ${error.message}`)
      throw new Error();
    }
    return validatedEnvConfig;
  }

  get port(): number {
    return parseInt(this.envConfig.PORT);
  }

  get merchantKey(): string {
    return this.envConfig.MERCHANT_KEY;
  }

  get merchantURL(): string {
    return this.envConfig.MERCHANT_URL
  }

  get paymentSuccessURL(): string {
    return this.envConfig.PAYMENT_SUCCESS_URL
  }

  get paymentErrorURL(): string {
    return this.envConfig.PAYMENT_ERROR_URL
  }

  get merchantName(): string {
    return this.envConfig.MERCHANT_NAME
  }

  get merchantCode(): string {
    return this.envConfig.MERCHANT_CODE
  }

}