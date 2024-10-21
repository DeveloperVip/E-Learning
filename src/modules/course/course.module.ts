import { Module } from '@nestjs/common';
import { CourseServices } from './course.service';

@Module({
  imports: [],
  exports: [CourseServices],
  controllers: [],
  providers: [CourseServices],
})
export class CourseModule {}
