import { Module } from '@nestjs/common';
import { EmailService } from '@shared';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';

@Module({
  imports: [],
  controllers: [InvoiceController],
  providers: [InvoiceService, EmailService],
  exports: [InvoiceService],
})
export class InvoiceModule {}
