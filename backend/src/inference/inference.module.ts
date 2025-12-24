import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InferenceController } from './controller/inference.controller';
import { InferenceService } from './service/inference.service';
import { Image, ImageSchema } from './schema/image.schema';

const noDb = process.env.NO_DB === 'true';
const dbImports = noDb
  ? []
  : [MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }])];

@Module({
  imports: dbImports,
  controllers: [InferenceController],
  providers: [InferenceService],
})
export class InferenceModule {}
