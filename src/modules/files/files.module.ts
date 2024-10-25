import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { FileUploadController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';

import { FileUploadService } from './files.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { diskStorage } from 'multer';

import { CloudinaryProvider } from '../cloudinary/cloudinary.provider';
import { AuthLibModule } from 'src/libs/auth-lib/auth.lib.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,
    CloudinaryModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const fileDriver = configService.get<string>('FILE_DRIVER');
        if (fileDriver === 'local') {
          const localStorage = () => {
            return diskStorage({
              destination: './upload',
              filename: (req, file, callback) => {
                const extension = file.originalname
                  .split('.')
                  .pop()
                  ?.toLowerCase();
                const filename = `${Date.now()}-${file.originalname.split('.')[0]}.${extension}`;
                callback(null, filename);
              },
            });
          };
          return {
            fileFilter: (request, file, callback) => {
              if (
                !file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|docx|pptx)$/i)
              )
                return callback(
                  new HttpException(
                    {
                      status: HttpStatus.UNPROCESSABLE_ENTITY,
                      error: {
                        file: 'Invalid file type',
                      },
                    },
                    HttpStatus.UNPROCESSABLE_ENTITY,
                  ),
                  false,
                );
            },
            storage: localStorage,
            limits: {
              fileSize: configService.get<number>('FILE_MAX_SIZE', {
                infer: true,
              }),
            },
          };
        } else {
          return {};
        }
      },
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '60s',
        },
      }),
    }),
    AuthLibModule,
  ],
  controllers: [FileUploadController],
  providers: [CloudinaryProvider, FileUploadService, AuthLibModule],
})
export class FileUploadModule {}
