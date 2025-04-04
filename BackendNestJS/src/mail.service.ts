import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'dhurtado9611@gmail.com', // Reemplaza con tu correo real
      pass: 'Mauroh918*',    // Usa una App Password si tienes 2FA en Gmail
    },
  });

  async enviarCorreoConAdjunto(destinatario: string, archivo: Express.Multer.File) {
    const mailOptions = {
      from: '"Sistema de Turnos" <dhurtado9611@gmail.com>',
      to: 'dhurtado9611@gmail.com',
      subject: 'Resumen de Turno',
      text: 'Adjunto encontrarás el resumen del turno.',
      attachments: [
        {
          filename: archivo.originalname,
          content: archivo.buffer,
        },
      ],
    };

    return this.transporter.sendMail(mailOptions);
  }
}