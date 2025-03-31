import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    console.log('AppController inicializado: ruta "/" registrada');
  }

  @Get()
  getRoot(): string {
    return this.appService.getRoot();
  }
}
