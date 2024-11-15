import {
  // FRONTEND_DOMAIN,
  MAIL_FROM,
  MAIL_HOST,
  MAIL_PASSWORD,
  MAIL_PORT,
  MAIL_USER,
} from '@config';
import { Injectable, Logger } from '@nestjs/common';
import { readFile } from 'fs/promises';
import Handlebars from 'handlebars';
import { createTransport, SendMailOptions, Transporter } from 'nodemailer';
import * as path from 'path';

@Injectable()
export class EmailService {
  private logger = new Logger(EmailService.name);
  private readonly transporter: Transporter;
  constructor() {
    this.transporter = createTransport({
      host: MAIL_HOST,
      port: parseInt(MAIL_PORT),
      secure: false,
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
    this.logger.log(templatePath);
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

  async sendVerificationEmail(
    email: string,
    confirmationCode: number,
  ): Promise<void> {
    this.logger.log(email, confirmationCode);
    // const url = `${FRONTEND_DOMAIN}/auth/confirm/token= ${token}`;
    const templatePath = path.join(
      process.cwd(),
      'dist',
      'assets',
      'libs',
      'mail',
      'src',
      'template-email',
      'mail.hbs',
    );
    try {
      // Gửi email
      await this.sendMail({
        to: email,
        subject: 'Xác nhận',
        templatePath: templatePath,
        context: {
          title: 'Xác nhận email',
          confirmationCode: confirmationCode,
        },
      });
      this.logger.log('Verification email sent successfully');
    } catch (error) {
      this.logger.error('Failed to send verification email:', error);
      throw new Error('Error sending verification email');
    }
  }
}
