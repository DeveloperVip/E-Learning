import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import {
  Controller,
  Logger,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileUploadService } from './files.service';
import { UploadResponse } from './files.upload.response';
import { JwtAuthGuard } from 'src/libs/auth-lib/jwt-auth.guard';

@Controller('files-upload')
@ApiTags('Files-upload')
export class FileUploadController {
  private readonly logger = new Logger(FileUploadController.name);
  constructor(private readonly fileService: FileUploadService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse | UploadResponse> {
    this.logger.log('file', file);
    if (!file) {
      throw new Error('No file uploaded');
    }
    return await this.fileService.uploadFile(file);
  }
}
