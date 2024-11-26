import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { EmailService } from '@shared';

@Injectable()
export class InvoiceService {
  constructor(private readonly emailService: EmailService) {}

  async generateInvoiceAndSendEmail(invoiceData: any): Promise<void> {
    const pdfPath = path.join(
      __dirname,
      `invoice-${invoiceData.orderCode}.pdf`,
    );

    // 1. Create PDF file
    const doc = new PDFDocument({ margin: 30 });
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    // Invoice content
    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('HÓA ĐƠN GIÁ TRỊ GIA TĂNG (VAT)', { align: 'center' })
      .moveDown();

    doc
      .fontSize(12)
      .font('Helvetica')
      .text(`Tên công ty: ${invoiceData.companyName}`)
      .text(`Mã số thuế: ${invoiceData.taxCode}`)
      .text(`Địa chỉ công ty: ${invoiceData.companyAddress}`)
      .moveDown();

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text(`Hóa đơn số: ${invoiceData.orderCode}`)
      .text(`Ngày lập hóa đơn: ${new Date().toLocaleDateString()}`)
      .moveDown();

    doc.fontSize(12).font('Helvetica-Bold').text('Thông tin sản phẩm/dịch vụ:');
    invoiceData.products.forEach((product, index) => {
      doc
        .fontSize(11)
        .font('Helvetica')
        .text(
          `${index + 1}. ${product.name} - Số lượng: ${product.quantity} - Đơn giá: ${product.price} VND`,
        );
    });
    doc.moveDown();

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text(`Tổng cộng: ${invoiceData.total} VND`)
      .text(`VAT (10%): ${(invoiceData.total * 0.1).toFixed(2)} VND`)
      .text(`Tổng thanh toán: ${(invoiceData.total * 1.1).toFixed(2)} VND`)
      .moveDown();

    doc
      .fontSize(10)
      .font('Helvetica-Oblique')
      .text('Cảm ơn quý khách đã mua hàng!', { align: 'center' });

    doc.end();

    // 2. Wait for PDF file to finish
    await new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });

    // 3. Send email with attached PDF
    await this.emailService.sendInvoiceEmail(invoiceData.email, pdfPath);

    // 4. Delete temporary PDF file
    fs.unlinkSync(pdfPath);
  }
}
