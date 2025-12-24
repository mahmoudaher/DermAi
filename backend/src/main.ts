import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'node:path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // Check if NO_DB is set, if not and MongoDB might not be available, warn user
  const noDb = process.env.NO_DB === 'true';
  if (noDb) {
    console.log('ℹ️  Running in NO_DB mode (MongoDB disabled)');
  } else {
    console.log('ℹ️  Attempting to connect to MongoDB...');
    console.log(
      'ℹ️  If MongoDB is not running, set NO_DB=true to skip database connection',
    );
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // Allow server to start even if some modules fail to initialize
    abortOnError: false,
  });

  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:3001', // Next.js default port
    credentials: true,
  });

  // Serve uploaded files statically
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Backend server running on http://localhost:${port}`);
  console.log(`📡 API endpoint: http://localhost:${port}/inference/upload`);
  if (!noDb) {
    console.log(
      '⚠️  Note: MongoDB connection may still be retrying in background',
    );
  }
}
bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
