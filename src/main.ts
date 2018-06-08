import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useStaticAssets(__dirname + '/public');
  app.setBaseViewsDir(__dirname + '/views')
  app.setViewEngine('hbs');
  await app.listen(app.get('ConfigService')['port']);
}
bootstrap();