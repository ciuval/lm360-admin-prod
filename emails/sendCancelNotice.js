import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export async function sendCancelNotice(email) {
  const html = fs.readFileSync(path.resolve('emails/email-disdetta.html'), 'utf8');

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"LoveMatch360" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "⚠️ Abbonamento Premium annullato",
    html,
  });

  console.log(`📧 Email di disdetta Premium inviata a ${email}`);
}
