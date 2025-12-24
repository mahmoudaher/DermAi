import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ImageDocument = Image & Document;

@Schema({ timestamps: true })
export class Image {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  predicted_class: string;

  @Prop({ required: true })
  confidence: number;

  // created_at is automatically added by timestamps: true
  // Mongoose adds createdAt and updatedAt fields automatically
}

export const ImageSchema = SchemaFactory.createForClass(Image);
