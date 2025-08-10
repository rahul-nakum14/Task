import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendActionItemEmail(
  to: string,
  subject: string,
  html: string
) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    html
  };

  return transporter.sendMail(mailOptions);
}
