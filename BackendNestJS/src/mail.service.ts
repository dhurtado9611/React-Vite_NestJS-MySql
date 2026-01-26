import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter;

  constructor(private configService: ConfigService) {
    // Configuramos el transporte usando variables de entorno
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('MAIL_USER'), // Lee del .env
        pass: this.configService.get<string>('MAIL_PASS'), // Lee del .env
      },
    });
  }

  async enviarCorreoConAdjunto(destinatario: string, archivo: Express.Multer.File) {
    const usuarioRemitente = this.configService.get<string>('MAIL_USER');

    const mailOptions = {
      from: `"Sistema de Turnos" <${usuarioRemitente}>`,
      to: destinatario, // Se envía al correo que pases como argumento
      subject: 'Resumen de Turno',
      text: 'Adjunto encontrarás el resumen del turno en formato Excel.',
      attachments: [
        {
          filename: archivo.originalname,
          content: archivo.buffer,
        },
      ],
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Correo enviado correctamente:', info.messageId);
      return { message: 'Correo enviado', id: info.messageId };
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw error;
    }
  }
}