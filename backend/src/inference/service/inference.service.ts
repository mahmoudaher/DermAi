import { Injectable, Logger, Optional } from '@nestjs/common';
import { Image, ImageDocument } from '../schema/image.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

@Injectable()
export class InferenceService {
  private readonly logger = new Logger(InferenceService.name);
  private readonly pythonScriptPath: string;
  private readonly pythonExecutable: string;

  constructor(
    @Optional()
    @InjectModel(Image.name)
    private readonly imageModel?: Model<ImageDocument>,
  ) {
    const projectRoot = path.resolve(__dirname, '../../../..');
    this.pythonScriptPath = path.join(projectRoot, 'ai', 'run_inference.py');
    const venvPythonWin = path.join(projectRoot, 'ai', 'venv', 'Scripts', 'python.exe');
    const venvPythonUnix = path.join(projectRoot, 'ai', 'venv', 'bin', 'python');
    this.pythonExecutable = 
      process.platform === 'win32' ? venvPythonWin : venvPythonUnix;
  }

  async predict(
    imagePath: string,
  ): Promise<{ predicted_class: string; confidence: number }> {
    try {
      const command = `"${this.pythonExecutable}" "${this.pythonScriptPath}" "${imagePath}"`;
      this.logger.log(`Executing: ${command}`);

      const { stdout, stderr } = await execAsync(command, {
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer for output
        timeout: 60000, // 60 second timeout
      });

      if (stderr && !stderr.includes('Warning')) {
        this.logger.warn(`Python stderr: ${stderr}`);
      }

      // Parse JSON output from Python script
      const result = JSON.parse(stdout.trim());
      
      // Validate result structure
      if (!result.predicted_class || typeof result.confidence !== 'number') {
        throw new Error('Invalid prediction result format');
      }

      return {
        predicted_class: result.predicted_class,
        confidence: result.confidence,
      };
    } catch (error) {
      this.logger.error(`Prediction failed: ${error.message}`, error.stack);
      throw new Error(`Failed to run inference: ${error.message}`);
    }
  }

  async saveResult(
    filename: string,
    predicted_class: string,
    confidence: number,
  ): Promise<ImageDocument | null> {
    try {
      if (!this.imageModel) {
        return null;
      }
      const newImage = new this.imageModel({ filename, predicted_class, confidence });
      return await newImage.save();
    } catch (error) {
      this.logger.warn(
        `Failed to save to MongoDB: ${error.message}. Prediction still returned to user.`,
      );
      return null;
    }
  }
}
