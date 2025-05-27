import { NestFactory } from '@nestjs/core';
import { AppModule } from './models/app/app.module';

import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const logger = new Logger('Bootstrap');
  const port = configService.get<number>('PORT', 8000);
  const environment = configService.get<string>('NODE_ENV', 'development');

  app.enableCors({
    origin: configService.get('CORS_ORIGIN', '*'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.use(cookieParser());

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  if (environment === 'development') {
    const configSwagger = new DocumentBuilder()
      .setTitle('Todo APP - API Documentation')
      .setDescription('Comprehensive API documentation for Todo Application')
      .setVersion('1.0')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
      })
      .addServer(`http://localhost:${port}`, 'Local Development Server')
      .build();

    const document = SwaggerModule.createDocument(app, configSwagger);
    SwaggerModule.setup('api-docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
      customSiteTitle: 'Todo APP API Docs',
      jsonDocumentUrl: 'api-docs/json',
    });

    logger.log(`Swagger documentation available at /api-docs`);
  }

  await app.listen(port, '0.0.0.0');
  logger.log(`Application is running on: ${await app.getUrl()}/api/v1`);
  logger.log(`Environment: ${environment}`);
}

bootstrap().catch((err) => {
  new Logger('Bootstrap').error('Failed to start application', err.stack);
  process.exit(1);
});
