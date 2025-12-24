import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { InferenceService } from '../service/inference.service';
import * as path from 'path';
import * as fs from 'fs';

interface MulterFile {
  filename: string;
  path: string;
  originalname: string;
  mimetype: string;
}

@Controller('inference')
export class InferenceController {
  constructor(private readonly inferenceService: InferenceService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
  )
  async uploadFile(@UploadedFile() file: MulterFile) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    try {
      const result = await this.inferenceService.predict(file.path);

      const saved = await this.inferenceService.saveResult(
        file.filename,
        result.predicted_class,
        result.confidence,
      );

      if (!saved) {
        console.warn('Result not saved to MongoDB (MongoDB unavailable)');
      }

      return {
        ...result,
        filename: file.filename,
        originalname: file.originalname,
      };
    } catch (error) {
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw new InternalServerErrorException(
        `Failed to process image: ${error.message}`,
      );
    }
  }
}
