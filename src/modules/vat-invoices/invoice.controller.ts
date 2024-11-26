import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create.dto';

@Controller('invoice')
@ApiTags('Invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post('send')
  async sendInvoice(@Body() invoiceData: CreateInvoiceDto): Promise<void> {
    // Call the service to generate and send the invoice
    await this.invoiceService.generateInvoiceAndSendEmail(invoiceData);
  }
}
