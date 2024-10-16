import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFile } from 'fs';
import Handlebars from 'handlebars';
import { createTransport, SendMailOptions, Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter: Transporter;
  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });
  }

  async sendMail({
    templatePath,
    context,
    ...mailOptions
  }: SendMailOptions & {
    templatePath: string;
    context: Record<string, unknown>;
  }): Promise<void> {
    let html: string | undefined;
    if (templatePath) {
      const template = await readFile(templatePath, 'utf-8');
      html = await Handlebars.compile(template, { strict: true })(context);
    }
    await this.transporter.sendMail({
      ...mailOptions,
      from: mailOptions.from || this.configService.get('MAIL_FROM'),
      html: mailOptions.html ? mailOptions.html : html,
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const url = `${this.configService.get('FRONTEND_DOMAIN')}/auth/confirm/token= ${token}`;
    await this.sendMail({
      to: email,
      subject: 'Xác nhận',
      templatePath: `${process.cwd()}/dist/assets/template/mail.hbs`,
      context: {
        title: 'Xác nhận email',
        url,
      },
    });
  }
  
}
