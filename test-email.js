// test-email.js

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
});

const sendTestEmail = async () => {
  try {
    const info = await transporter.sendMail({
      from: `"LoveMatch360" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // oppure un altro indirizzo tuo
      subject: "✅ Test email riuscito",
      html: `<h1>Funziona!</h1><p>Hai ricevuto questa email da LoveMatch360 (test).</p>`
    });

    console.log("📧 Email inviata:", info.messageId);
  } catch (error) {
    console.error("❌ Errore invio email:", error);
  }
};

sendTestEmail();

