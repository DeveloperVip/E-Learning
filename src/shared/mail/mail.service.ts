import {
  FRONTEND_DOMAIN,
  MAIL_FROM,
  MAIL_HOST,
  MAIL_PASSWORD,
  MAIL_PORT,
  MAIL_USER,
} from '@config';
import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import Handlebars from 'handlebars';
import { createTransport, SendMailOptions, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly transporter: Transporter;
  constructor() {
    this.transporter = createTransport({
      host: MAIL_HOST,
      port: parseInt(MAIL_PORT),
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD,
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
      from: mailOptions.from || `"${MAIL_USER}" <${MAIL_FROM}>`,
      html: mailOptions.html ? mailOptions.html : html,
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const url = `${FRONTEND_DOMAIN}/auth/confirm/token= ${token}`;
    await this.sendMail({
      to: email,
      subject: 'Xác nhận',
      templatePath: `${process.cwd()}/dist/assets/libs/mail/src/template-email/mail.hbs`,
      context: {
        title: 'Xác nhận email',
        url,
      },
    });
  }
}
