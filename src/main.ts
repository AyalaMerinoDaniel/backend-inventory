import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './interceptors/response/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    skipMissingProperties: false,
  }));

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  const config = new DocumentBuilder()
  .setTitle('Inventario API')
  .setDescription('Documentación de la API de Inventario')
  .setVersion('1.0')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new ResponseInterceptor());

 await app.listen(process.env.PORT || 3000, '0.0.0.0');

}
bootstrap();
