import { Controller, Post, UploadedFile, UseInterceptors, Body, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MailService } from './mail.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024; // 5MB: suficiente para un resumen de turno en Excel

@UseGuards(JwtAuthGuard)
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('enviar')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_ATTACHMENT_BYTES } }))
  async enviar(@UploadedFile() file: Express.Multer.File, @Body('email') email: string) {
    return this.mailService.enviarCorreoConAdjunto(email, file);
  }
}