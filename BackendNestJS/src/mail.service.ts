import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tucorreo@gmail.com', // Reemplaza con tu correo real
      pass: 'tupasswordoappkey',  // Usa una App Password si tienes 2FA
    },
  });

  async enviarCorreoConAdjunto(destinatario: string, archivo: Express.Multer.File) {
    const mailOptions = {
      from: '"Sistema de Turnos" <tucorreo@gmail.com>',
      to: destinatario,
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