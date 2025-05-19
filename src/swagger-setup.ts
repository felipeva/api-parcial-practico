import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Airlines Coverage API')
    .setDescription('API for managing airlines, airports, and their coverage')
    .setVersion('1.0')
    .addTag('airlines')
    .addTag('airports')
    .addTag('airlines-airports')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Ensure the directory exists
  const outputDir = path.join(process.cwd(), 'collections');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write the OpenAPI specification to a file
  fs.writeFileSync(
    path.join(outputDir, 'openapi-spec.json'),
    JSON.stringify(document, null, 2),
  );

  console.log('OpenAPI specification saved to collections/openapi-spec.json');

  await app.close();
}

bootstrap();
