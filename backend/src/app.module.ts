import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InferenceModule } from './inference/inference.module';

const noDb = process.env.NO_DB === 'true';

// Try to connect to MongoDB, but don't block if it fails
const mongooseConfig = {
  uri: 'mongodb://localhost:27017/dermAI',
  serverSelectionTimeoutMS: 500, // Very short timeout - fail fast
  connectTimeoutMS: 500, // Very short timeout - fail fast
  family: 4, // prefer IPv4
  retryWrites: false, // Don't retry writes
  retryReads: false, // Don't retry reads
  // Non-blocking: buffer commands if connection is not ready
  bufferCommands: true,
  bufferMaxEntries: 0,
  // Don't retry connection attempts that block startup
  maxPoolSize: 1,
  // Skip initial connection check
  autoIndex: false,
  // Don't retry on connection failure
  retry: false,
};

@Module({
  imports: noDb
    ? [InferenceModule]
    : [
        MongooseModule.forRoot(mongooseConfig.uri, mongooseConfig),
        InferenceModule,
      ],
  controllers: [],
  providers: [],
})
export class AppModule {}
