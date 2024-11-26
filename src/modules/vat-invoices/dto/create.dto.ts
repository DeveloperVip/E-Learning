import { IsString, IsNumber, IsArray, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoiceDto {
  @ApiProperty({
    description: 'The unique order code for the invoice',
    example: 'ORDER12345',
  })
  @IsString()
  orderCode: string;

  @ApiProperty({
    description: 'The name of the company issuing the invoice',
    example: 'My Company',
  })
  @IsString()
  companyName: string;

  @ApiProperty({
    description: 'The tax code of the company issuing the invoice',
    example: '123456789',
  })
  @IsString()
  taxCode: string;

  @ApiProperty({
    description: 'The address of the company issuing the invoice',
    example: '123 Street, City',
  })
  @IsString()
  companyAddress: string;

  @ApiProperty({
    description: 'The email address where the invoice will be sent',
    example: 'customer@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'List of products included in the invoice',
    type: [Object],
    example: [
      { name: 'Product A', quantity: 2, price: 50000 },
      { name: 'Product B', quantity: 1, price: 30000 },
    ],
  })
  @IsArray()
  products: { name: string; quantity: number; price: number }[];

  @ApiProperty({
    description: 'Total amount of the invoice without VAT',
    example: 130000,
  })
  @IsNumber()
  total: number;
}
