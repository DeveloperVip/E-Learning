// cloudinary.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { CloudinaryResponse } from './cloudinary.response';

@Injectable()
export class CloudinaryService {
  private logger = new Logger(CloudinaryService.name);
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    this.logger.log(file);
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
