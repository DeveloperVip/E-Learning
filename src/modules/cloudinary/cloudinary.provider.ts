import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider: Provider = {
  provide: 'CLOUDINARY',
  inject: [ConfigService],
  useFactory: (ConfigService: ConfigService) => {
    cloudinary.config({
      cloud_name: ConfigService.get('CLOUD_NAME'),
      api_key: ConfigService.get('API_KEY-CLOUD'),
      api_secret: ConfigService.get('API_SERCRET_CLOUD'),
    });
  },
};
