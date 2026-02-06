import { Controller, Post, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('enviar')
  @UseInterceptors(FileInterceptor('file'))
  async enviar(@UploadedFile() file: Express.Multer.File, @Body('email') email: string) {
    return this.mailService.enviarCorreoConAdjunto(email, file);
  }
}