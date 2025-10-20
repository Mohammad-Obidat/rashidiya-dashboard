import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  // Enable CORS for your frontend
  app.enableCors({
    origin: 'https://rashidiya-dashboard.vercel.app', // || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    // allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT || 3000);
  console.log(
    `Application is running on: http://localhost:${process.env.PORT || 3000}`,
  );
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
  process.exit(1);
});
