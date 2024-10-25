import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // @Post('upload')
  // uploadImage() {

  async uploadFile(file: Express.Multer.File) {
    const fileDriver = this.configService.get<string>('FILE_DRIVER');
    if (!file) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'select file',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    if (fileDriver === 'cloudinary') {
      // Upload file lên Cloudinary
      return this.cloudinaryService.uploadFile(file);
    } else {
      // Nếu là local, file đã được lưu trên disk bởi Multer, trả về thông tin file
      return {
        message: 'File uploaded locally',
        filename: file.filename,
        path: `./upload/${file.filename}`,
      };
    }
  }
}
