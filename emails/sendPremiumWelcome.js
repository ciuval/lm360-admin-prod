import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export async function sendPremiumWelcome(email) {
  const html = fs.readFileSync(path.resolve('emails/email-premium.html'), 'utf8');

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
    subject: "🎉 Premium attivato su LoveMatch360",
    html,
  });

  console.log(`📧 Email di benvenuto Premium inviata a ${email}`);
}
