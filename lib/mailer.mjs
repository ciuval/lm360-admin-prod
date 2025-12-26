import nodemailer from 'nodemailer';
import { Env } from './env.mjs';

let transporter;

export function getMailer() {
  const hasSmtp = Env.SMTP_HOST && Env.SMTP_USER && Env.SMTP_PASS;
  if (!hasSmtp) {
    return {
      async sendMail(opts) {
        console.log('[MAIL MOCK] →', { to: opts.to, subject: opts.subject });
        return { mock: true, messageId: `mock-${Date.now()}` };
      }
    };
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: Env.SMTP_HOST,
      port: Env.SMTP_PORT,
      secure: Env.SMTP_PORT === 465,
      auth: { user: Env.SMTP_USER, pass: Env.SMTP_PASS },
    });
  }
  return transporter;
}
