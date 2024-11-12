import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FileSizeValidatorPipe implements PipeTransform {
  private logger = new Logger(FileSizeValidatorPipe.name);
  transform(value: any, metaData: ArgumentMetadata) {
    this.logger.log('value', value, metaData);
    const limit = 5242880;
    if (value > 5242880) {
      this.logger.log(value);
      throw new BadRequestException('File size less 1kb');
    }
    return value < limit;
  }
}
